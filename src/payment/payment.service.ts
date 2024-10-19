import { Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Rent } from 'src/rent/entities/rent.entity';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async create(
    createPaymentDto: CreatePaymentDto,
    rent: Rent,
  ): Promise<Payment> {
    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      rent,
    });
    return this.paymentRepository.save(payment);
  }

  async findAllFromRent(
    rentId: string,
    referedMonth?: number,
    referedYear?: number,
  ): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: { rent: { id: rentId }, referedMonth, referedYear },
      relations: ['rent'],
      loadRelationIds: true,
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string) {
    return await this.paymentRepository.findOneBy({ id });
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentRepository.update(id, updatePaymentDto);
    return this.paymentRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return await this.paymentRepository.delete(id);
  }
}