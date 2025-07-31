import { Injectable, NotFoundException } from '@nestjs/common';
import { ToggleSavePostDto } from './dto/ToggleSavePostDto';
import { SavePost } from 'src/entities/SavePost';
import { User } from 'src/entities/User';
import { Post } from 'src/entities/Post';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import UserResponseDto from '../user/dto/UserResponseDto';

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
                relations: ['user', 'post', 'post.images']
            });

            savedPosts.forEach(savedPost => {
                savedPost.user = plainToInstance(UserResponseDto, savedPost.user, {
                    excludeExtraneousValues: true,
                }) as any
            });

            return savedPosts;

        } catch (error) {
            console.error('Error getting saved posts by user:', error);
            throw error;
        }
    }

    async toggleSavePost(toggleSavePostDto: ToggleSavePostDto, userId: number) {
        try {
            let savePost: SavePost;
            const existingSavePost = await this.savePostRepository.findOne({
                where: {
                    post: { postId: toggleSavePostDto.postId },
                    user: { userId }
                },
                // tôi muốn relation postImage nữa thì làm sao
                relations: ['post', 'post.images']
            });

            if (existingSavePost) {
                savePost = existingSavePost;
                await this.savePostRepository.delete(existingSavePost.savePostId);
                //  return { message: 'Unsave post successfully' };
                return { ...savePost.post, isSaved: false };
            }

            const user = await this.userRepository.findOne({ where: { userId } });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            const userResponse = plainToInstance(UserResponseDto, user, {
                excludeExtraneousValues: true,
            }) as any

            const post = await this.postRepository.findOne({
                where: { postId: toggleSavePostDto.postId },
                relations: ['images']
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            savePost = this.savePostRepository.create({ post, user });
            await this.savePostRepository.save(savePost);
            //  return { message: 'Save post successfully' };
            return { ...savePost.post, isSaved: true };

        } catch (error) {
            console.error('Error toggling save post:', error);
            throw error;
        }
    }
}
