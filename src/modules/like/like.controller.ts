import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { ToggleLikeDto } from './dto/ToggleLikeDto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@Controller('like')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly likeService: LikeService) { }

  @Get('get-liked-posts')
  getLikedPosts(@Req() req: any) {
    const userId = req.user.userId;
    return this.likeService.getLikedPosts(userId);
  }

  @Post('toggle-like')
  toggleLike(@Req() req: any, @Body() toggleLikeDto: ToggleLikeDto) {
    const userId = req.user.userId;
    return this.likeService.toggleLike(toggleLikeDto, userId);
  }
}
