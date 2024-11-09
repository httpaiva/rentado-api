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
    userId: string,
    rentId: string,
    referedMonth?: number,
    referedYear?: number,
  ): Promise<Payment[]> {
    return await this.paymentRepository.find({
      where: {
        rent: {
          id: rentId,
          user: { id: userId }, // Filtra pelo userId na relação rent.user
        },
        referedMonth,
        referedYear,
      },
      relations: ['rent', 'rent.location', 'rent.renter', 'rent.user'], // Inclui a relação rent.user
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string) {
    const result = await this.paymentRepository.find({
      where: { id },
      relations: ['rent', 'rent.location', 'rent.renter'],
      order: { id: 'ASC' },
    });
    return result[0];
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    await this.paymentRepository.update(id, updatePaymentDto);
    return this.paymentRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return await this.paymentRepository.delete(id);
  }
}
