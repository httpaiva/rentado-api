import { Location } from 'src/locations/entities/location.entity';
import { Renter } from 'src/renter/entities/renter.entity';

export class CreateRentDto {
  id: string;
  initialDate: Date;
  endDate: Date;
  price: number;
  paymentDate: Date;
  active: boolean;
  renter: Renter;
  location: Location;
}
