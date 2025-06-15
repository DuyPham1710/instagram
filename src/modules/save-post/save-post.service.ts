import { Injectable, NotFoundException } from '@nestjs/common';
import { ToggleSavePostDto } from './dto/ToggleSavePostDto';
import { SavePost } from 'src/entities/SavePost';
import { User } from 'src/entities/User';
import { Post } from 'src/entities/Post';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SavePostService {
    constructor(
        @InjectRepository(SavePost)
        private readonly savePostRepository: Repository<SavePost>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    async getSavedPostsByUser(userId: number) {
        try {
            const savedPosts = await this.savePostRepository.find({
                where: { user: { userId } },
                relations: ['post']
            });

            return savedPosts;

        } catch (error) {
            console.error('Error getting saved posts by user:', error);
            throw error;
        }
    }

    async toggleSavePost(toggleSavePostDto: ToggleSavePostDto, userId: number) {
        try {
            const existingSavePost = await this.savePostRepository.findOne({
                where: {
                    post: { postId: toggleSavePostDto.postId },
                    user: { userId }
                }
            });

            if (existingSavePost) {
                await this.savePostRepository.delete(existingSavePost.savePostId);
                return { message: 'Unsave post successfully' };
            }

            const user = await this.userRepository.findOne({ where: { userId } });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            const post = await this.postRepository.findOne({
                where: { postId: toggleSavePostDto.postId },
                relations: ['user']
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            const savePost = this.savePostRepository.create({ post, user });
            await this.savePostRepository.save(savePost);
            return { message: 'Save post successfully' };

        } catch (error) {
            console.error('Error toggling save post:', error);
            throw error;
        }
    }
}
