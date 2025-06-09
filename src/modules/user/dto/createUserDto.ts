import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    Length
} from "class-validator";

export default class createUserDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    avatarUrl?: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 14, { message: 'Password must be between 6 and 14 characters' })
    password: string;
}