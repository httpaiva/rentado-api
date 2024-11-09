// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    };
    const user: User = { id: '1', ...createUserDto } as User;

    jest.spyOn(repository, 'create').mockReturnValue(user);
    jest.spyOn(repository, 'save').mockResolvedValue(user);

    expect(await service.create(createUserDto)).toEqual(user);
  });

  it('should update a user', async () => {
    const id = '1';
    const updateUserDto: UpdateUserDto = { firstName: 'Jane' };
    const user: User = {
      id: '1',
      email: 'test@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'password',
    } as User;

    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

    expect(await service.update(id, updateUserDto)).toEqual(user);
  });

  it('should find all users', async () => {
    const users: User[] = [
      {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password',
      },
    ] as User[];

    jest.spyOn(repository, 'find').mockResolvedValue(users);

    expect(await service.findAll()).toEqual(users);
  });

  it('should find one user by email', async () => {
    const email = 'test@example.com';
    const user: User = {
      id: '1',
      email,
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    } as User;

    jest.spyOn(repository, 'findOne').mockResolvedValue(user);

    expect(await service.findOneByEmail(email)).toEqual(user);
  });

  it('should find one user by id', async () => {
    const id = '1';
    const user: User = {
      id,
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
    } as User;

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

    expect(await service.findOne(id)).toEqual(user);
  });

  it('should remove a user', async () => {
    const id = '1';

    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    expect(await service.remove(id)).toEqual({ affected: 1 });
  });
});
