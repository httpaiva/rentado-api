import { Rent } from 'src/rent/entities/rent.entity';

export class CreatePaymentDto {
  id: string;
  paymentDate: Date;
  referedMonth: number;
  referedYear: number;
  value: number;
  rent: Rent;
}
