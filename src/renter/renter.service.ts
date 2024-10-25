import { Injectable } from '@nestjs/common';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Renter } from './entities/renter.entity';

@Injectable()
export class RenterService {
  constructor(
    @InjectRepository(Renter)
    private readonly rentersRepository: Repository<Renter>,
  ) {}

  async create(createRenterDto: CreateRenterDto, user: User): Promise<Renter> {
    const renter = this.rentersRepository.create({
      ...createRenterDto,
      user,
    });

    return this.rentersRepository.save(renter);
  }

  async findAllFromUser(userId: string): Promise<Renter[]> {
    return await this.rentersRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string) {
    return await this.rentersRepository.findOneBy({ id });
  }

  async update(
    id: string,
    updateRenterDto: UpdateRenterDto,
  ): Promise<Renter | null> {
    await this.rentersRepository.update(id, updateRenterDto);
    return this.rentersRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return await this.rentersRepository.delete(id);
  }
}
