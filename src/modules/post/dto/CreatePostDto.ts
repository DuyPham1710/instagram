import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostDto {
    @ApiProperty({ example: '' })
    @IsNotEmpty()
    @IsString()
    contentUrl: string;

    @ApiProperty({ example: 'This is a caption' })
    @IsNotEmpty()
    @IsString()
    caption: string;
}