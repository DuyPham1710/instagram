import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ToggleLikeDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    postId: number;
}