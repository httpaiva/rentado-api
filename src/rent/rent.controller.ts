import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { RentService } from './rent.service';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
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
  async create(@Body() createRentDto: CreateRentDto, @GetUser() user: User) {
    if (!createRentDto.renter || !createRentDto.location) {
      throw new BadRequestException();
    }
    const newRent = {
      ...createRentDto,
      initialDate: new Date(createRentDto.initialDate),
      endDate: new Date(createRentDto.endDate),
      paymentDate: new Date(createRentDto.paymentDate),
    };

    return this.rentService.create(newRent, user);
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
