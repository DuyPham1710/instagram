import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import UserResponseDto from "src/modules/user/dto/UserResponseDto";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super();
    }

    async validate(username: string, password: string): Promise<UserResponseDto> {
        const user = await this.userService.validateUser(username, password);
        return user;
    }

}