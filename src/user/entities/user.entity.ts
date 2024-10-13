import { Location } from 'src/locations/entities/location.entity';
import { Renter } from 'src/renter/entities/renter.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];

  @OneToMany(() => Renter, (renter) => renter.user)
  renters: Renter[];
}
