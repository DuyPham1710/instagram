import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { CreateCommentDto } from './dto/CreateCommentDto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UpdateCommentDto } from './dto/UpdateCommentDto';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  @Get()
  getCommentsByPostId(@Query('postId') postId: number) {
    return this.commentService.getCommentsByPostId(postId);
  }

  @Post()
  createComment(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.commentService.createComment(createCommentDto, userId);
  }


  @Patch()
  editComment(@Body() updateCommentDto: UpdateCommentDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.commentService.editComment(updateCommentDto, userId);
  }

  @Delete('/:id')
  deleteComment(@Param('id') commentId: number, @Req() req: any) {
    const userId = req.user.userId;
    return this.commentService.deleteComment(commentId, userId);
  }
}
