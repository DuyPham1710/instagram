import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';
import UserResponseDto from './dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';
import createUserDto from './dto/createUserDto';
import UpdateUserDto from './dto/updateUserDto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find({
            // select: [
            //     'userId',
            //     'fullName',
            //     'email',
            //     'username',
            //     'avatarUrl',
            //     'bio',
            //     'isActive',
            //     'createdAt',
            // ],
        });
        return plainToInstance(UserResponseDto, users, {
            excludeExtraneousValues: true
        });
    }

    async findOne(userId: number): Promise<UserResponseDto> {
        const user = await this.userRepository.findOne({
            where: { userId },
            // select: [
            //     'userId',
            //     'fullName',
            //     'email',
            //     'username',
            //     'avatarUrl',
            //     'bio',
            //     'isActive',
            //     'createdAt',
            // ],
        });
        if (!user) {
            throw new HttpException(`User with ID ${userId} not found`, HttpStatus.NOT_FOUND);
        }
        return plainToInstance(UserResponseDto, user, {
            excludeExtraneousValues: true
        });
    }

    async create(createUserDto: createUserDto): Promise<UserResponseDto> {
        const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
        if (existingUser) {
            throw new BadRequestException('Email is already in use');
        }

        const existingUsername = await this.userRepository.findOne({ where: { username: createUserDto.username } });
        if (existingUsername) {
            throw new BadRequestException('Username is already taken');
        }

        const user = this.userRepository.create(createUserDto);
        user.createdAt = new Date;
        user.otpGenaratedTime = new Date;
        const savedUser = await this.userRepository.save(user);
        return plainToInstance(UserResponseDto, savedUser, {
            excludeExtraneousValues: true
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        await this.userRepository.update(id, updateUserDto);
        return this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.userRepository.delete(id);
    }
}
