import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/User';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    getAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @Get(':id')
    getOne(@Param('id') id: number): Promise<User> {
        return this.userService.findOne(id);
    }

    @Post()
    create(@Body() data: Partial<User>): Promise<User> {
        return this.userService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() data: Partial<User>): Promise<User> {
        return this.userService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: number): Promise<void> {
        return this.userService.remove(id);
    }
}
