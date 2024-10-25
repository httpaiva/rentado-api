import { Rent } from 'src/rent/entities/rent.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Renter {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  document_cpf: string;

  @Column()
  document_rg: string;

  @Column()
  nationality?: string;

  @Column()
  birthDate?: Date;

  @Column()
  maritalStatus?: string;

  @Column()
  ocupation?: string;

  @ManyToOne(() => User, (user) => user.renters, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Rent, (rent) => rent.renter)
  rents: Rent[];
}
