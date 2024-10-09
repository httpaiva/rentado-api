import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneBy({
      email: createUserDto.email,
    });

    if (user) {
      throw new UnauthorizedException(`This e-mail is already in use`);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    return this.usersRepository.save(newUser);
  }

  async update(id: string, user: UpdateUserDto): Promise<User | null> {
    await this.usersRepository.update(id, user);
    return this.usersRepository.findOneBy({ id });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'password'], // explicitly select the password
    });
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
