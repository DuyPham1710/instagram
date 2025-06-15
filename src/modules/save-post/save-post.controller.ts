import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { SavePostService } from './save-post.service';
import { ToggleSavePostDto } from './dto/ToggleSavePostDto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('save-post')
export class SavePostController {
  constructor(private readonly savePostService: SavePostService) { }

  @Get('get-saved-posts')
  getSavedPostsByUser(@Req() req: any) {
    const userId = req.user.userId;
    return this.savePostService.getSavedPostsByUser(userId);
  }

  @Post('toggle-save-post')
  toggleSavePost(@Req() req: any, @Body() toggleSavePostDto: ToggleSavePostDto) {
    const userId = req.user.userId;
    return this.savePostService.toggleSavePost(toggleSavePostDto, userId);
  }
}
