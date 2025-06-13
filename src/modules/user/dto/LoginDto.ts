import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'duy' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: 'my_password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}