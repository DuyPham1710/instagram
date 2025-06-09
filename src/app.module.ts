import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/User';

@Module({
  imports: [UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'instagram',
      entities: [User],     // list entity refactor
      synchronize: true,  // tự động tạo bảng từ entity (Chỉ dùng trong môi trường dev)
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
