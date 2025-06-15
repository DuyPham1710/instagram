import { Injectable, NotFoundException } from '@nestjs/common';
import { ToggleLikeDto } from './dto/ToggleLikeDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from 'src/entities/Like';
import { User } from 'src/entities/User';
import { Post } from 'src/entities/Post';
import { Repository } from 'typeorm';

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

    async toggleLike(toggleLikeDto: ToggleLikeDto, userId: number) {
        try {
            // check like exist
            const existingLike = await this.likeRepository.findOne({
                where: {
                    user: { userId },
                    post: { postId: toggleLikeDto.postId }
                }
            });

            if (existingLike) {
                await this.likeRepository.delete(existingLike.likeId);
                return { message: 'Unlike successfully' };
            }

            const user = await this.userRepository.findOne({ where: { userId } });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const post = await this.postRepository.findOne({
                where: { postId: toggleLikeDto.postId },
                relations: ['user']
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            const like = this.likeRepository.create({ ...toggleLikeDto, user, post });
            await this.likeRepository.save(like);
            return { message: 'Like successfully' };
        } catch (error) {
            console.error('Error creating like:', error);
            throw error;
        }
    }
}
