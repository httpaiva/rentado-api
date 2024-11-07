import { Location } from 'src/locations/entities/location.entity';
import { Rent } from 'src/rent/entities/rent.entity';
import { Renter } from 'src/renter/entities/renter.entity';
import { Template } from 'src/template/entities/template.entity';
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

  @Column({
    nullable: true,
    unique: true,
  })
  document_cpf?: string;

  @Column({
    nullable: true,
    unique: true,
  })
  document_rg?: string;

  @Column({
    nullable: true,
  })
  nationality?: string;

  @Column({
    nullable: true,
  })
  birthDate?: Date;

  @Column({
    nullable: true,
  })
  maritalStatus?: string;

  @Column({
    nullable: true,
  })
  ocupation?: string;

  @Column({
    nullable: true,
  })
  country?: string;

  @Column({
    nullable: true,
  })
  state?: string;

  @Column({
    nullable: true,
  })
  city?: string;

  @Column({
    nullable: true,
  })
  neighborhood?: string;

  @Column({
    nullable: true,
  })
  street?: string;

  @Column({
    nullable: true,
  })
  number?: string;

  @Column({
    nullable: true,
  })
  complement?: string;

  @Column({
    nullable: true,
  })
  postalCode?: string;

  @OneToMany(() => Location, (location) => location.user)
  locations: Location[];

  @OneToMany(() => Renter, (renter) => renter.user)
  renters: Renter[];

  @OneToMany(() => Rent, (rent) => rent.user)
  rents: Rent[];

  @OneToMany(() => Template, (template) => template.user)
  templates: Template[];
}
