import { Injectable } from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { Template } from './entities/template.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TemplateService {
  constructor(
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
  ) {}

  async create(
    createTemplateDto: CreateTemplateDto,
    user: User,
  ): Promise<Template> {
    const template = this.templatesRepository.create({
      ...createTemplateDto,
      user,
    });

    return this.templatesRepository.save(template);
  }

  async findAllFromUser(userId: string): Promise<Template[]> {
    return await this.templatesRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Template | null> {
    return await this.templatesRepository.findOne({
      where: { id },
      relations: ['user'],
      order: { id: 'ASC' },
    });
  }

  async update(
    id: string,
    updateTemplateDto: UpdateTemplateDto,
  ): Promise<Template | null> {
    await this.templatesRepository.update(id, updateTemplateDto);
    return this.templatesRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return await this.templatesRepository.delete(id);
  }
}
