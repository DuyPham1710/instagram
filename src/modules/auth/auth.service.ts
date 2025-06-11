import { Injectable } from '@nestjs/common';
import UserResponseDto from '../user/dto/UserResponseDto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService
    ) { }

    async login(user: UserResponseDto) {
        const payload = { username: user.username, sub: user.userId };
        const refreshToken = this.jwtService.sign(payload, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE });

        await this.userService.updateRefreshToken(user.userId, refreshToken);
        return {
            token: this.jwtService.sign(payload),
            refreshToken: refreshToken
        };
    }

    async verifyRefreshToken(refreshToken: string) {
        const decoded = this.jwtService.decode(refreshToken);
        if (decoded) {
            const user = await this.userService.verifyRefreshToken(refreshToken, decoded.sub);
            if (user) {
                return user;
            }
        }
        return null;
    }

}
