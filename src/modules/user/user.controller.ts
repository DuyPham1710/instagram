import {
    Body,
    Controller,
    Delete, Get,
    Param,
    ParseIntPipe,
    Post,
    Put,
    Req
} from '@nestjs/common';
import { UserService } from './user.service';
import createUserDto from './dto/createUserDto';
import UpdateUserDto from './dto/updateUserDto';
import UserResponseDto from './dto/UserResponseDto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAll(@Req() req: Request & { user: string }): Promise<UserResponseDto[]> {
        console.log(req.user);
        return this.userService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: number): Promise<UserResponseDto> {
        return this.userService.findOne(id);
    }

    // @Post()
    // create(@Body() createUserDto: createUserDto): Promise<UserResponseDto> {
    //     return this.userService.create(createUserDto);
    // }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.userService.remove(id);
    }
}
