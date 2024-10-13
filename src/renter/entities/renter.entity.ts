import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Renter {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  fisrtName: string;

  @Column()
  lastName: string;

  @Column()
  document_cpf: string;

  @Column()
  document_rg: string;

  @Column()
  nationality?: string;

  @Column()
  birthDate?: string;

  @Column()
  maritalStatus?: string;

  @Column()
  ocupation?: string;

  @ManyToOne(() => User, (user) => user.renters, { onDelete: 'CASCADE' })
  user: User;
}
