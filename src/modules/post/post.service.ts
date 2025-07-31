import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { PostImage } from 'src/entities/PostImage';
import { In, Repository } from 'typeorm';
import { CreatePostDto } from './dto/CreatePostDto';
import { User } from 'src/entities/User';
import { UpdatePostDto } from './dto/UpdatePostDto';
import { Follow } from 'src/entities/Follow';
import UserResponseDto from '../user/dto/UserResponseDto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
        @InjectRepository(PostImage)
        private readonly postImageRepository: Repository<PostImage>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Follow)
        private readonly followRepository: Repository<Follow>
    ) { }

    async getAllPostsFollowing(userId: number) {
        const following = await this.followRepository.find({
            where: { follower: { userId } },
            relations: ['following']
        });

        const followingIds = following.map(follow => follow.following.userId);

        const posts = await this.postRepository.find({
            where: { user: { userId: In(followingIds) } },
            relations: ['images', 'user']
        });

        posts.forEach(post => {
            post.user = plainToInstance(UserResponseDto, post.user, {
                excludeExtraneousValues: true,
            }) as any;
        });

        return posts;
    }

    async getAllPostsByUser(userId: number) {
        const posts = await this.postRepository.find({
            where: { user: { userId } },
            relations: ['images']
        });
        return posts;
    }

    async createPost(createPostDto: CreatePostDto, userId: number): Promise<{ message: string }> {
        try {
            const user = await this.userRepository.findOne({ where: { userId } });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Tạo post mới
            // const post = this.postRepository.create({
            //     caption: createPostDto.caption,
            //     user
            // });
            const post = this.postRepository.create({ ...createPostDto, user });
            const savedPost = await this.postRepository.save(post);

            // Tạo các PostImage cho post
            if (createPostDto.images && createPostDto.images.length > 0) {
                const postImages = createPostDto.images.map(imageDto =>
                    this.postImageRepository.create({
                        imageUrl: imageDto.imageUrl,
                        caption: imageDto.caption,
                        order: imageDto.order || 0,
                        post: savedPost
                    })
                );
                await this.postImageRepository.save(postImages);
            }

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
                relations: ['user', 'images']
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            if (post.user.userId !== userId) {
                throw new ForbiddenException('You are not allowed to update this post');
            }

            // Cập nhật thông tin cơ bản của post
            if (updatePostDto.caption !== undefined) {
                await this.postRepository.update(post.postId, { caption: updatePostDto.caption });
            }

            // Cập nhật images nếu có
            if (updatePostDto.images) {
                // Xóa tất cả images cũ
                await this.postImageRepository.delete({ post: { postId: post.postId } });

                // Tạo images mới
                if (updatePostDto.images.length > 0) {
                    const postImages = updatePostDto.images.map(imageDto =>
                        this.postImageRepository.create({
                            imageUrl: imageDto.imageUrl,
                            caption: imageDto.caption,
                            order: imageDto.order || 0,
                            post: { postId: post.postId }
                        })
                    );
                    await this.postImageRepository.save(postImages);
                }
            }

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
