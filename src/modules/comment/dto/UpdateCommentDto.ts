import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateCommentDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    commentId: number;

    @ApiProperty({ example: 'This is a comment' })
    @IsNotEmpty()
    @IsString()
    content: string;
}