import { Location } from 'src/locations/entities/location.entity';
import { Payment } from 'src/payment/entities/payment.entity';
import { Renter } from 'src/renter/entities/renter.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  initialDate: Date;

  @Column()
  endDate: Date;

  @Column()
  price: number;

  @Column()
  paymentDate: Date;

  @Column()
  active: boolean;

  @ManyToOne(() => Renter, (renter) => renter.rents, { onDelete: 'CASCADE' })
  renter: Renter;

  @ManyToOne(() => Location, (location) => location.rents, {
    onDelete: 'CASCADE',
  })
  location: Location;

  @ManyToOne(() => User, (user) => user.rents, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Payment, (payment) => payment.rent)
  payments: Payment[];
}
