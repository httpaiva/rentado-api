import { Injectable } from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { Repository } from 'typeorm';
import { Rent } from './entities/rent.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Renter } from 'src/renter/entities/renter.entity';
import { Location } from 'src/locations/entities/location.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RentService {
  constructor(
    @InjectRepository(Rent)
    private readonly rentsRepository: Repository<Rent>,
  ) {}

  create(
    createRentDto: CreateRentDto,
    renter: Renter,
    location: Location,
    user: User,
  ): Promise<Rent> {
    const rent = this.rentsRepository.create({
      ...createRentDto,
      renter,
      location,
      user,
    });

    return this.rentsRepository.save(rent);
  }

  async findAllFromUser({
    userId,
    active,
  }: {
    userId: string;
    active?: boolean;
  }): Promise<Rent[]> {
    const whereCondition: any = {
      user: { id: userId },
    };

    // Adiciona a condição de filtro pela propriedade "active" se ela for fornecida
    if (active !== undefined) {
      whereCondition.active = active;
    }

    return await this.rentsRepository.find({
      where: whereCondition,
      relations: ['user', 'renter', 'location'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Rent | null> {
    return await this.rentsRepository.findOne({
      where: { id },
      relations: ['renter', 'location'],
      order: { id: 'ASC' },
    });
  }

  async update(id: string, updateRentDto: UpdateRentDto): Promise<Rent | null> {
    await this.rentsRepository.update(id, updateRentDto);
    return this.rentsRepository.findOne({
      where: { id },
      relations: ['renter', 'location'],
    });
  }

  async remove(id: string) {
    return await this.rentsRepository.delete(id);
  }
}
