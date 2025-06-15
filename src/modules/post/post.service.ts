import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/CreatePostDto';
import { User } from 'src/entities/User';
import { UpdatePostDto } from './dto/UpdatePostDto';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }

    async getAllPostsByUser(userId: number) {
        const posts = await this.postRepository.find({ where: { user: { userId } } });
        return posts;
    }

    async createPost(createPostDto: CreatePostDto, userId: number): Promise<{ message: string }> {
        try {
            const user = await this.userRepository.findOne({ where: { userId } });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const post = this.postRepository.create({ ...createPostDto, user });
            await this.postRepository.save(post);
            return { message: 'Post created successfully' };
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    }

    async updatePost(updatePostDto: UpdatePostDto, userId: number): Promise<{ message: string }> {
        try {
            const post = await this.postRepository.findOne({
                where: { postId: updatePostDto.postId },
                relations: ['user']
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            if (post.user.userId !== userId) {
                throw new ForbiddenException('You are not allowed to update this post');
            }

            await this.postRepository.update(post.postId, updatePostDto);
            return { message: 'Post updated successfully' };
        } catch (error) {
            console.error('Error updating post:', error);
            throw error;
        }
    }

    async deletePost(postId: number, userId: number): Promise<{ message: string }> {
        const post = await this.postRepository.findOne({
            where: { postId },
            relations: ['user']
        });

        if (!post) {
            throw new NotFoundException('Post not found');
        }

        if (post.user.userId !== userId) {
            throw new ForbiddenException('You are not allowed to update this post');
        }

        await this.postRepository.delete(postId);
        return { message: 'Post deleted successfully' };
    }
}
