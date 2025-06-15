import { Module } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { SavePostController } from './save-post.controller';
import { Post } from 'src/entities/Post';
import { User } from 'src/entities/User';
import { SavePost } from 'src/entities/SavePost';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [SavePostController],
  providers: [SavePostService],
  imports: [TypeOrmModule.forFeature([SavePost, User, Post])],
})
export class SavePostModule { }
