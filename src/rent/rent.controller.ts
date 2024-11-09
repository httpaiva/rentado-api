import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { Renter } from 'src/renter/entities/renter.entity';
import { Location } from 'src/locations/entities/location.entity';
import { LocationsService } from 'src/locations/locations.service';
import { RenterService } from 'src/renter/renter.service';
import { GetUser } from 'src/user/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { Rent } from './entities/rent.entity';

@Controller('rents')
export class RentController {
  constructor(
    private readonly rentService: RentService,
    private readonly locationsService: LocationsService,
    private readonly renterService: RenterService,
  ) {}

  @Post()
  async create(
    @Body() createRentDto: CreateRentDto,
    @GetUser() user: User,
    renterId: Renter['id'],
    locationId: Location['id'],
  ) {
    const newRent = {
      ...createRentDto,
      initialDate: new Date(createRentDto.initialDate),
      endDate: new Date(createRentDto.endDate),
      paymentDate: new Date(createRentDto.paymentDate),
    };
    const renter = await this.renterService.findOne(renterId);

    if (!renter) {
      throw new NotFoundException(`Renter not found`);
    }

    const location = await this.locationsService.findOne(locationId);

    if (!location) {
      throw new NotFoundException(`Location not found`);
    }

    return this.rentService.create(newRent, renter, location, user);
  }

  @Get()
  async findAll(
    @GetUser() user: User,
    @Query()
    params: {
      active?: boolean;
    },
  ): Promise<Rent[]> {
    return await this.rentService.findAllFromUser({
      userId: user.id,
      active: params.active,
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.rentService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateRentDto: UpdateRentDto) {
    return await this.rentService.update(id, updateRentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.rentService.remove(id);
  }
}
