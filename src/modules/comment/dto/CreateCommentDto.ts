import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDto {
    @ApiProperty({ example: 'This is a comment' })
    @IsNotEmpty()
    @IsString()
    content: string;

    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    postId: number;
}