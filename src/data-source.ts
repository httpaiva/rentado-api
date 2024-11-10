// src/data-source.ts
import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Location } from './locations/entities/location.entity';
import { Renter } from './renter/entities/renter.entity';
import { Rent } from './rent/entities/rent.entity';
import { Payment } from './payment/entities/payment.entity';
import { Template } from './template/entities/template.entity';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'db',
  port: 5432,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [User, Location, Renter, Rent, Payment, Template],
  synchronize: false,
  migrations: ['dist/migrations/*.js'],
};

export const AppDataSource = new DataSource(dataSourceOptions);
