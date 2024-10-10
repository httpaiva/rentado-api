import { Injectable } from '@nestjs/common';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from './entities/location.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(Location)
    private readonly locationsRepository: Repository<Location>,
  ) {}

  async create(
    createLocationDto: CreateLocationDto,
    user: User,
  ): Promise<Location> {
    const location = this.locationsRepository.create({
      ...createLocationDto,
      user,
    });

    return this.locationsRepository.save(location);
  }

  async findAllFromUser(userId: string): Promise<Location[]> {
    return await this.locationsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      loadRelationIds: true,
      order: { id: 'ASC' }, // you can adjust the ordering as needed
    });
  }

  async findOne(id: string) {
    return await this.locationsRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<Location | null> {
    await this.locationsRepository.update(id, updateLocationDto);
    return this.locationsRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return await this.locationsRepository.delete(id);
  }
}
