import { Injectable, NotFoundException } from '@nestjs/common';
import { ToggleLikeDto } from './dto/ToggleLikeDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/Like';
import { User } from 'src/entities/User';
import { Post } from 'src/entities/Post';
import { Repository } from 'typeorm';
import UserResponseDto from '../user/dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    async getLikedPosts(userId: number) {
        try {
            const likedPosts = await this.likeRepository.find({
                where: { user: { userId } },
                relations: ['user', 'post', 'post.images']
            });

            likedPosts.forEach(likedPost => {
                likedPost.user = plainToInstance(UserResponseDto, likedPost.user, {
                    excludeExtraneousValues: true,
                }) as any
            });

            return likedPosts;
        } catch (error) {
            console.error('Error getting liked posts by user:', error);
            throw error;
        }

    }


    async toggleLike(toggleLikeDto: ToggleLikeDto, userId: number) {
        try {
            let like: Like;

            // check like exist
            const existingLike = await this.likeRepository.findOne({
                where: {
                    user: { userId },
                    post: { postId: toggleLikeDto.postId }
                },
                relations: ['post', 'post.images']
            });

            if (existingLike) {
                like = existingLike;
                await this.likeRepository.delete(existingLike.likeId);
                return { ...like.post, isLiked: false };
            }

            const user = await this.userRepository.findOne({ where: { userId } });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const post = await this.postRepository.findOne({
                where: { postId: toggleLikeDto.postId },
                relations: ['images']
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            like = this.likeRepository.create({ ...toggleLikeDto, user, post });
            await this.likeRepository.save(like);
            return { ...like.post, isLiked: true };
        } catch (error) {
            console.error('Error creating like:', error);
            throw error;
        }
    }
}
