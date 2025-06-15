import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdatePostDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    postId: number;

    @ApiProperty({ example: '' })
    @IsNotEmpty()
    @IsString()
    contentUrl: string;

    @ApiProperty({ example: 'This is a caption' })
    @IsNotEmpty()
    @IsString()
    caption: string;

    createdAt: Date = new Date();
}