import { IsNotEmpty, IsString } from "class-validator";

export class VerifyAccountDto {
    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    otp: string;
}