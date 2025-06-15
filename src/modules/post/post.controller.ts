import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';


@ApiBearerAuth()
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    getAllPostsByUser(@Req() req: any) {
        const userId = req.user.userId;
        return this.postService.getAllPostsByUser(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    createPost(@Body() createPostDto: CreatePostDto, @Req() req: any) {
        const userId = req.user.userId;
        return this.postService.createPost(createPostDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch()
    updatePost(@Body() updatePostDto: UpdatePostDto, @Req() req: any) {
        const userId = req.user.userId;
        return this.postService.updatePost(updatePostDto, userId);
    }

    @UseGuards(JwtAuthGuard)
    @Delete('/:id')
    deletePost(@Param('id') postId: number, @Req() req: any) {
        const userId = req.user.userId;
        return this.postService.deletePost(postId, userId);
    }
}
