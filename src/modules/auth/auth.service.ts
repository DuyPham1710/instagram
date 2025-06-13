import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import UserResponseDto from '../user/dto/UserResponseDto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { VerifyAccountDto } from '../user/dto/VerifyAccountDto';
import { plainToInstance } from 'class-transformer';
import ResetPasswordDto from '../user/dto/resetPasswordDto';
import { MailService } from '../mail/mail.service';
import { generateOtp } from 'src/utils/OtpUtil';
import UpdateUserDto from '../user/dto/updateUserDto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailService: MailService
    ) { }

    async login(user: UserResponseDto) {
        const payload = { username: user.username, sub: user.userId };
        const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE });

        await this.userService.updateRefreshToken(user.userId, refreshToken);
        return {
            token: this.jwtService.sign(payload),
            refreshToken: refreshToken
        };
    }

    async verifyRefreshToken(refreshToken: string) {
        const decoded = this.jwtService.decode(refreshToken);
        if (decoded) {
            const user = await this.userService.verifyRefreshToken(refreshToken, decoded.sub);
            if (user) {
                return user;
            }
        }
        return null;
    }

    async verifyAccount(verifyAccountDto: VerifyAccountDto): Promise<UserResponseDto> {
        const user = await this.userService.findByEmail(verifyAccountDto.email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (user.otp === verifyAccountDto.otp && user.otpGenaratedTime > new Date(Date.now() - 1000 * 60 * 5)) {
            user.isActive = true;
            await this.userService.update(user.userId, user);

            return plainToInstance(UserResponseDto, user, {
                excludeExtraneousValues: true
            });
        }
        throw new UnauthorizedException('OTP is invalid or has expired. Please regenerate a new OTP and try again.');
    }

    async resendOtp(email: string) {
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const otp: string = generateOtp(6);

        await this.mailService.sendMail(user.email, user.fullName, otp);

        const updateUser: UpdateUserDto = {
            otp: otp,
            otpGenaratedTime: new Date()
        }

        const userUpdated = await this.userService.update(user.userId, updateUser);

        return {
            message: 'A new OTP has been sent to your email. Please check your inbox and verify account within 5 minute.'
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userService.findByEmail(resetPasswordDto.email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (resetPasswordDto.newPassword === resetPasswordDto.confirmNewPassword) {
            user.password = await bcrypt.hash(resetPasswordDto.newPassword, 10);
            await this.userService.update(user.userId, user);
            return {
                message: 'Password reset successfully'
            };
        }
        throw new BadRequestException('Password and confirm password do not match. Please try again!');
    }
}
