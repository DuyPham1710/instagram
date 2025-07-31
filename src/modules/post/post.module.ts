import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { PostImage } from 'src/entities/PostImage';
import { User } from 'src/entities/User';
import { Follow } from 'src/entities/Follow';

@Module({
    controllers: [PostController],
    providers: [PostService],
    imports: [TypeOrmModule.forFeature([Post, PostImage, User, Follow])],
})
export class PostModule { }
