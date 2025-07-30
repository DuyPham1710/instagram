import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePostImageDto {
    @ApiProperty({ example: 'https://example.com/image.jpg' })
    @IsNotEmpty()
    @IsString()
    imageUrl: string;

    @ApiProperty({ example: 'Image caption', required: false })
    @IsOptional()
    @IsString()
    caption?: string;

    @ApiProperty({ example: 0, required: false })
    @IsOptional()
    order?: number;
}

export class CreatePostDto {
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
        ]
    })
    @IsNotEmpty()
    @IsArray()
    images: CreatePostImageDto[];

    @ApiProperty({ example: 'This is a post caption', required: false })
    @IsOptional()
    @IsString()
    caption?: string;
}