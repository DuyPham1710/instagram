import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';
import { LoggingMiddleware } from './middleware/logging/logging.middleware';
import { AuthModule } from './modules/auth/auth.module';
import * as path from 'path';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './modules/post/post.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, }),
        UserModule,
        AuthModule,
        PostModule,
        TypeOrmModule.forRoot({
            type: process.env.DB_TYPE as any,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT as any,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [User],     // list entity refactor
            synchronize: true,  // tự động tạo bảng từ entity (Chỉ dùng trong môi trường dev)
        }),

        // mailer
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.MAIL_HOST,
                    port: process.env.MAIL_PORT as any,
                    // ignoreTLS: true,
                    secure: true,
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASSWORD,
                    },
                },
                defaults: {
                    from: '"No Reply" <no-reply@localhost>',
                },
                // preview: true,
                template: {
                    dir: path.join(__dirname, 'modules/mail/templates'),
                    adapter: new HandlebarsAdapter(),
                    options: {
                        strict: true,
                    },
                },
            }),


        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    // configure(consumer: MiddlewareConsumer) {
    //   consumer
    //     .apply(LoggingMiddleware)
    //     .forRoutes(
    //       {
    //         path: '/users',
    //         method: RequestMethod.ALL
    //       }
    //     );
    // }
}
