import { Module } from '@nestjs/common';
import { RentService } from './rent.service';
import { RentController } from './rent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rent } from './entities/rent.entity';
import { Renter } from 'src/renter/entities/renter.entity';
import { Location } from 'src/locations/entities/location.entity';
import { LocationsModule } from 'src/locations/locations.module';
import { RenterModule } from 'src/renter/renter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rent, Location, Renter]),
    LocationsModule,
    RenterModule,
  ],
  controllers: [RentController],
  providers: [RentService],
})
export class RentModule {}
