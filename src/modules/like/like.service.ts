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
            let likedPosts: Like[];
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
                likedPosts = await this.getLikedPostByPostId(toggleLikeDto.postId);
                return { ...like.post, likePost: likedPosts, isLiked: false };
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

            likedPosts = await this.getLikedPostByPostId(toggleLikeDto.postId);

            return { ...like.post, likePost: likedPosts, isLiked: true };
        } catch (error) {
            console.error('Error creating like:', error);
            throw error;
        }
    }

    async getLikedPostByPostId(postId: number) {
        const likedPost = await this.likeRepository.find({
            where: { post: { postId } },
            relations: ['user']
        });

        likedPost.forEach(like => {
            like.user = plainToInstance(UserResponseDto, like.user, {
                excludeExtraneousValues: true,
            }) as any;
        });

        return likedPost;
    }
}
