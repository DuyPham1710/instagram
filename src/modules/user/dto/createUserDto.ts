import { ApiProperty } from "@nestjs/swagger";
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length
} from "class-validator";

export default class createUserDto {
    @ApiProperty({ example: '' })
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: '' })
    @IsOptional()
    @IsString()
    bio?: string;

    @ApiProperty({ example: '' })
    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @ApiProperty({ example: '' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '' })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({ example: '' })
    @IsString()
    @IsNotEmpty()
    @Length(6, 14, { message: 'Password must be between 6 and 14 characters' })
    password: string;
}