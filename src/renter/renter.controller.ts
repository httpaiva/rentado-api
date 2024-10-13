import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RenterService } from './renter.service';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from 'src/user/user.decorator';
import { Renter } from './entities/renter.entity';

@Controller('renters')
export class RenterController {
  constructor(private readonly renterService: RenterService) {}

  @Get()
  async findAll(@GetUser() user: User): Promise<Renter[]> {
    return await this.renterService.findAllFromUser(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.renterService.findOne(id);
  }

  @Post()
  async create(
    @Body() createRenterDto: CreateRenterDto,
    @GetUser() user: User,
  ) {
    const renter = await this.renterService.create(createRenterDto, user);
    return renter;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRenterDto: UpdateRenterDto,
  ) {
    return await this.renterService.update(id, updateRenterDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.renterService.remove(id);
  }
}
