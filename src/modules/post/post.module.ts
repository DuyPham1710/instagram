import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { User } from 'src/entities/User';

@Module({
    controllers: [PostController],
    providers: [PostService],
    imports: [TypeOrmModule.forFeature([Post, User])],
})
export class PostModule { }
