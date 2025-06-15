import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class ToggleFollowDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    @IsNumber()
    followingId: number;
}