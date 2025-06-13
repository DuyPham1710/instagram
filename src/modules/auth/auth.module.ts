import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from 'src/passport/local.strategy';
import { jwtStrategy } from 'src/passport/jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { MailModule } from '../mail/mail.module';

@Module({
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, jwtStrategy],
    imports: [
        ConfigModule.forRoot(),
        UserModule,
        PassportModule,
        MailModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: process.env.JWT_TOKEN_EXPIRE }
        })
    ]
})
export class AuthModule { }
