import { Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllPostsByUser() {
    return "Get All Posts By User";
  }

  @Post()
  createPost() {

  }

  @Patch()
  updatePost() {

  }

  @Delete()
  deletePost() {

  }
}
