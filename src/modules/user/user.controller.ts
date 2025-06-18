import {
    Body,
    Controller,
    Delete, Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Query,
    Req,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Patch
} from '@nestjs/common';
import { UserService } from './user.service';
import UpdateUserDto from './dto/updateUserDto';
import UserResponseDto from './dto/UserResponseDto';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from '../cloudinary/cloudinary.storage';
import { Public } from 'src/utils/decorator.customize.utils';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAll(@Req() req: Request & { user: string }): Promise<UserResponseDto[]> {
        // console.log(req.user);
        return this.userService.findAll();
    }

    @Patch()
    @UseInterceptors(FileInterceptor('file', { storage }))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                fullName: { type: 'string', example: 'Nguyen Van A' },
                email: { type: 'string', example: 'abc@gmail.com' },
                username: { type: 'string', example: 'username123' },
                password: { type: 'string', example: 'mypassword' },
                bio: { type: 'string', example: 'This is my bio.' },
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    editProfile(
        @Req() req: any,
        @Body() updateUserDto: UpdateUserDto,
        @UploadedFile() file: Express.Multer.File): Promise<UserResponseDto> {
        if (file && file.path) {
            updateUserDto.avatarUrl = file.path;
        }
        return this.userService.update(req.user.userId, updateUserDto);
    }

    @Delete()
    delete(@Req() req: any): Promise<{ message: string }> {
        return this.userService.remove(req.user.userId);
    }

    @Get('profile')
    profile(@Req() req: any) {
        return req.user;
    }

    @Get('search')
    @Public()
    search(@Query('query') query: string): Promise<UserResponseDto[]> {
        return this.userService.searchUser(query);
    }

}
