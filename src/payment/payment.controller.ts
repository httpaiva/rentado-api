import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { Rent } from 'src/rent/entities/rent.entity';
import { RentService } from 'src/rent/rent.service';
import { GetUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly rentService: RentService,
  ) {}

  @Post()
  async create(@Body() createPaymentDto: CreatePaymentDto, rentId: Rent['id']) {
    const rent = await this.rentService.findOne(rentId);
    if (!rent) {
      throw new NotFoundException(`Rent not found`);
    }
    return this.paymentService.create(createPaymentDto, rent);
  }

  @Get()
  findAll(
    @GetUser()
    user: User,
    @Query()
    params: {
      rentId: string;
      referedMonth?: number;
      referedYear?: number;
    },
  ) {
    return this.paymentService.findAllFromRent(
      user.id,
      params.rentId,
      params.referedMonth,
      params.referedYear,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
