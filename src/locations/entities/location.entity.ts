import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  neighborhood: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  complement?: string;

  @Column()
  postalCode: string;

  @ManyToOne(() => User, (user) => user.locations, { onDelete: 'CASCADE' })
  user: User;
}
