import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { User } from 'src/entities/User';
import { Follow } from 'src/entities/Follow';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [FollowController],
  providers: [FollowService],
  imports: [TypeOrmModule.forFeature([Follow, User])],
})
export class FollowModule { }
