import { Body, Controller, Get, Patch, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import createUserDto from '../user/dto/createUserDto';
import UserResponseDto from '../user/dto/UserResponseDto';
import { LocalAuthGuard } from 'src/guard/local-auth.guard';
import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
import { VerifyAccountDto } from '../user/dto/VerifyAccountDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) { }

  @Post('register')
  register(@Body() createUserDto: createUserDto): Promise<UserResponseDto> {
    return this.userService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Req() userLoginRequest: any) {
    return this.authService.login(userLoginRequest.user);
  }

  @Post('refresh-token')
  async refreshToken(@Body() { refreshToken }: { refreshToken: string }) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const user = await this.authService.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return this.authService.login(user);
  }

  @Patch('verify-account')
  verifyAccount(@Body() verifyAccountDto: VerifyAccountDto) {
    return this.authService.verifyAccount(verifyAccountDto);
  }

  @Patch('resend-otp')
  resendOtp() {

  }

  @Patch('forgot-password')
  forgotPassword() {

  }

  @Patch('reset-password')
  resetPassword() {

  }
}
