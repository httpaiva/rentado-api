export class CreateRentDto {
  id: string;
  initialDate: Date;
  endDate: Date;
  price: number;
  paymentDate: Date;
  active: boolean;
}
