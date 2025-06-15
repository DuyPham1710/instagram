import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ToggleFollowDto } from './dto/ToggleFollowDto';

@Controller('follow')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) { }


  @Get('get-followers')
  getFollowers(@Req() req: any) {
    const userId = req.user.userId;
    return this.followService.getFollowers(userId);
  }

  @Get('get-following')
  getFollowing(@Req() req: any) {
    const userId = req.user.userId;
    return this.followService.getFollowing(userId);
  }

  @Post('toggle-follow')
  toggleFollow(@Req() req: any, @Body() toggleFollowDto: ToggleFollowDto) {
    const userId = req.user.userId;
    return this.followService.toggleFollow(toggleFollowDto, userId);
  }
}
