import { Rent } from 'src/rent/entities/rent.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  paymentDate: Date;

  @Column()
  referedMonth: number;

  @Column()
  referedYear: number;

  @Column()
  value: number;

  @ManyToOne(() => Rent, (rent) => rent.payments, { onDelete: 'CASCADE' })
  rent: Rent;
}
