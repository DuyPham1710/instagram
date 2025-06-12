import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import UserResponseDto from '../user/dto/UserResponseDto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { VerifyAccountDto } from '../user/dto/VerifyAccountDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
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
}
