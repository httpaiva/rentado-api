import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from 'src/rent/entities/rent.entity';
import { Payment } from './entities/payment.entity';
import { RentModule } from 'src/rent/rent.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Rent]), RentModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
