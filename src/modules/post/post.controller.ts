import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreatePostDto } from './dto/CreatePostDto';
import { UpdatePostDto } from './dto/UpdatePostDto';


@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) { }

    @Get('user/:id')
    getPostByUserId(@Param('id') userId: number) {
        return this.postService.getAllPostsByUser(userId);
    }

    @Get()
    getAllPostsByUser(@Req() req: any) {
        const userId = req.user.userId;
        return this.postService.getAllPostsByUser(userId);
    }

    @Get('following')
    getAllPostsFollowing(@Req() req: any) {
        const userId = req.user.userId;
        return this.postService.getAllPostsFollowing(userId);
    }

    @Post()
    createPost(@Body() createPostDto: CreatePostDto, @Req() req: any) {
        const userId = req.user.userId;
        return this.postService.createPost(createPostDto, userId);
    }

    @Patch()
    updatePost(@Body() updatePostDto: UpdatePostDto, @Req() req: any) {
        const userId = req.user.userId;
        return this.postService.updatePost(updatePostDto, userId);
    }

    @Delete('/:id')
    deletePost(@Param('id') postId: number, @Req() req: any) {
        const userId = req.user.userId;
        return this.postService.deletePost(postId, userId);
    }
}
