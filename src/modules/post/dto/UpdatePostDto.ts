import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { CreatePostImageDto } from "./CreatePostDto";

export class UpdatePostDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    postId: number;

    @ApiProperty({
        type: [CreatePostImageDto],
        example: [
            {
                imageUrl: 'https://example.com/image1.jpg',
                caption: 'First image',
                order: 0
            },
            {
                imageUrl: 'https://example.com/image2.jpg',
                caption: 'Second image',
                order: 1
            }
        ],
        required: false
    })
    @IsOptional()
    @IsArray()
    images?: CreatePostImageDto[];

    @ApiProperty({ example: 'This is a caption', required: false })
    @IsOptional()
    @IsString()
    caption?: string;

    createdAt: Date = new Date();
}