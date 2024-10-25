import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Location } from 'src/locations/entities/location.entity';
import { Template } from 'src/template/entities/template.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Location, Template])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
