import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ToggleSavePostDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    postId: number;
}