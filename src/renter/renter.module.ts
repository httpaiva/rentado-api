import { Module } from '@nestjs/common';
import { RenterService } from './renter.service';
import { RenterController } from './renter.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Renter } from './entities/renter.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Renter, User])],
  controllers: [RenterController],
  providers: [RenterService],
})
export class RenterModule {}
