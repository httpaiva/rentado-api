import { Location } from 'src/locations/entities/location.entity';
import { Renter } from 'src/renter/entities/renter.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Rent {
  @PrimaryGeneratedColumn()
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
}
