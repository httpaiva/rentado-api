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
      order: { id: 'ASC' },
    });
  }

  async findAllAvailable(userId: string): Promise<Location[]> {
    const results = await this.locationsRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'rents'],
      order: { id: 'ASC' },
    });

    // Filtra as locations onde todos os rents têm active = false ou não possuem rents
    const availableLocations = results.filter(
      (location) =>
        location.rents.length === 0 || // Inclui locations sem rents
        location.rents.every((rent) => rent.active === false), // Inclui locations onde todos os rents têm active = false
    );

    return availableLocations;
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
