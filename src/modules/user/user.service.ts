import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Like, Not, Repository } from 'typeorm';
import UserResponseDto from './dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';
import createUserDto from './dto/createUserDto';
import UpdateUserDto from './dto/updateUserDto';
import * as bcrypt from 'bcrypt';
import { generateOtp } from 'src/utils/OtpUtil';
import { MailerService } from '@nestjs-modules/mailer';
import { MailService } from '../mail/mail.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly mailerService: MailerService,
        private readonly mailService: MailService
    ) { }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find();
        return plainToInstance(UserResponseDto, users, {
            excludeExtraneousValues: true
        });
    }

    async findAllOther(userId: number): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find({ where: { userId: Not(userId) } });
        return plainToInstance(UserResponseDto, users, {
            excludeExtraneousValues: true
        });
    }

    async findOne(userId: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({
            where: { userId }
        });

        if (!user) {
            throw new HttpException(`User with ID ${userId} not found`, HttpStatus.NOT_FOUND);
        }
        return plainToInstance(UserResponseDto, user, {
            excludeExtraneousValues: true
        });
    }

    async register(createUserDto: createUserDto): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new BadRequestException('Email is already in use');
        }

        const existingUsername = await this.userRepository.findOne({ where: { username: createUserDto.username } });
        if (existingUsername) {
            throw new BadRequestException('Username is already taken');
        }

        // generate otp and send to email
        const otp: string = generateOtp(6);

        await this.mailService.sendMail(createUserDto.email, createUserDto.fullName, otp);
        // await this.mailerService
        //     .sendMail({
        //         to: createUserDto.email,
        //         subject: 'Active Account',
        //         text: 'Active Account',
        //         template: 'mail_template',
        //         context: {
        //             fullName: createUserDto.fullName,
        //             otp: otp,
        //         },
        //     })


        const user = this.userRepository.create(createUserDto);
        user.createdAt = new Date;
        user.otp = otp;
        user.otpGenaratedTime = new Date;

        user.password = await bcrypt.hash(createUserDto.password, 10);

        const savedUser = await this.userRepository.save(user);
        return plainToInstance(UserResponseDto, savedUser, {
            excludeExtraneousValues: true
        });
    }

    async findByUsername(username: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { username } });
        if (!user) {
            throw new HttpException(`User with username ${username} not found`, HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new HttpException(`User with email ${email} not found`, HttpStatus.NOT_FOUND);
        }
        return user;
    }

    async validateUser(username: string, password: string): Promise<UserResponseDto> {
        const user = await this.findByUsername(username);

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) {
            throw new UnauthorizedException('Invalid password');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Your account is not activated. Please verify your email to activate your account');
        }

        return user;
    }


    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.update(userId, { refreshToken: hashedRefreshToken });
    }

    async verifyRefreshToken(refreshToken: string, userId: number) {
        const user = await this.userRepository.findOne({ where: { userId } });
        if (user) {
            const status = await bcrypt.compare(refreshToken, user.refreshToken);
            if (status) {
                return user;
            }
        }
        return null;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<{ message: string }> {
        await this.userRepository.delete(id);
        return { message: 'User deleted successfully' };
    }

    async searchUser(query: string): Promise<UserResponseDto[]> {
        try {
            const users = await this.userRepository.find({
                where: [
                    { username: Like(`%${query}%`) },
                    { fullName: Like(`%${query}%`) }
                ],
            });

            return plainToInstance(UserResponseDto, users, {
                excludeExtraneousValues: true
            });
        } catch (error) {
            console.error('Error searching user:', error);
            throw error;
        }
    }
}
