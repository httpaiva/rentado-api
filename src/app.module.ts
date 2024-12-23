import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { LocationsModule } from './locations/locations.module';
import { ConfigModule } from '@nestjs/config';
import { RenterModule } from './renter/renter.module';
import { RentModule } from './rent/rent.module';
import { PaymentModule } from './payment/payment.module';
import { TemplateModule } from './template/template.module';
import { User } from './user/entities/user.entity';
import { Renter } from './renter/entities/renter.entity';
import { Rent } from './rent/entities/rent.entity';
import { Payment } from './payment/entities/payment.entity';
import { Template } from './template/entities/template.entity';
import { Location } from './locations/entities/location.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'db',
      port: 5432,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Location, Renter, Rent, Payment, Template],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthModule,
    LocationsModule,
    RenterModule,
    RentModule,
    PaymentModule,
    TemplateModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
