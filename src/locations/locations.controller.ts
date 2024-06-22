import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/user/user.decorator';

@Controller('locations')
export class LocationsController {
  constructor(private readonly locationService: LocationsService) {}

  @Get()
  async findAll(@GetUser() user: User): Promise<Location[]> {
    return await this.locationService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.locationService.findOne(id);
  }

  @Post()
  async create(
    @Body() createLocationDto: CreateLocationDto,
    @GetUser() user: User,
  ) {
    return await this.locationService.create(createLocationDto, user.id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    return await this.locationService.update(id, updateLocationDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.locationService.remove(id);
  }
}
