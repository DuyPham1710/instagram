import { Injectable, NotFoundException } from '@nestjs/common';
import { ToggleFollowDto } from './dto/ToggleFollowDto';
import { Follow } from 'src/entities/Follow';
import { User } from 'src/entities/User';
import { Post } from 'src/entities/Post';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import UserResponseDto from '../user/dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FollowService {
    constructor(
        @InjectRepository(Follow)
        private readonly followRepository: Repository<Follow>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }


    async getFollowers(userId: number) {
        try {
            const followers = await this.followRepository.find({
                where: { following: { userId } },
                relations: ['follower']
            });

            followers.forEach(follow => {
                follow.follower = plainToInstance(UserResponseDto, follow.follower, {
                    excludeExtraneousValues: true,
                }) as any;
            });

            return followers;
        } catch (error) {
            console.error('Error getting followers:', error);
            throw error;
        }
    }

    async getFollowing(userId: number) {
        try {
            const following = await this.followRepository.find({
                where: { follower: { userId } },
                relations: ['following']
            });

            following.forEach(follow => {
                follow.following = plainToInstance(UserResponseDto, follow.following, {
                    excludeExtraneousValues: true,
                }) as any;
            });

            return following;
        } catch (error) {
            console.error('Error getting following:', error);
            throw error;
        }
    }

    async toggleFollow(toggleFollowDto: ToggleFollowDto, userId: number) {
        try {
            // check follow exist
            const existingFollow = await this.followRepository.findOne({
                where: {
                    follower: { userId },
                    following: { userId: toggleFollowDto.followingId }
                }
            });

            if (existingFollow) {
                await this.followRepository.delete(existingFollow.followId);
                return { message: 'Unfollow successfully' };
            }

            const follower = await this.userRepository.findOne({ where: { userId } });

            if (!follower) {
                throw new NotFoundException('Follower not found');
            }

            const following = await this.userRepository.findOne({ where: { userId: toggleFollowDto.followingId } });

            if (!following) {
                throw new NotFoundException('Following not found');
            }

            const follow = this.followRepository.create({ follower, following });
            await this.followRepository.save(follow);
            return { message: 'Follow successfully' };
        } catch (error) {
            console.error('Error toggling follow:', error);
            throw error;
        }
    }
}
