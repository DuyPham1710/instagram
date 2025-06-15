import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from 'src/entities/Comment';
import { User } from 'src/entities/User';
import { Post } from 'src/entities/Post';
import { UpdateCommentDto } from './dto/UpdateCommentDto';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(Comment)
        private readonly commentRepository: Repository<Comment>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>,
    ) { }

    async getCommentsByPostId(postId: number) {
        const comments = await this.commentRepository.find({ where: { post: { postId } } });
        return comments;
    }

    async createComment(createCommentDto: CreateCommentDto, userId: number) {
        try {
            const user = await this.userRepository.findOne({ where: { userId } });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const post = await this.postRepository.findOne({
                where: { postId: createCommentDto.postId },
                relations: ['user']
            });

            if (!post) {
                throw new NotFoundException('Post not found');
            }

            const comment = this.commentRepository.create({ ...createCommentDto, user, post });
            await this.commentRepository.save(comment);
            return { message: 'Comment created successfully' };
        } catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }

    }

    async editComment(updateCommentDto: UpdateCommentDto, userId: number) {
        try {
            const comment = await this.commentRepository.findOne({
                where: { commentId: updateCommentDto.commentId },
                relations: ['user']
            });

            if (!comment) {
                throw new NotFoundException('Comment not found');
            }

            if (comment.user.userId !== userId) {
                throw new ForbiddenException('You are not allowed to update this comment');
            }

            await this.commentRepository.update(comment.commentId, updateCommentDto);
            return { message: 'Comment updated successfully' };

        } catch (error) {
            console.error('Error editing comment:', error);
            throw error;
        }
    }

    async deleteComment(commentId: number, userId: number) {
        const comment = await this.commentRepository.findOne(
            {
                where: { commentId },
                relations: ['user']
            });

        if (!comment) {
            throw new NotFoundException('Comment not found');
        }

        if (comment.user.userId !== userId) {
            throw new ForbiddenException('You are not allowed to delete this comment');
        }

        await this.commentRepository.delete(commentId);
        return { message: 'Comment deleted successfully' };
    }
}
