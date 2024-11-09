// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { RenterService } from './renter.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Renter } from './entities/renter.entity';
import { Repository } from 'typeorm';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';
import { User } from 'src/user/entities/user.entity';

describe('RenterService', () => {
  let service: RenterService;
  let repository: Repository<Renter>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RenterService,
        {
          provide: getRepositoryToken(Renter),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<RenterService>(RenterService);
    repository = module.get<Repository<Renter>>(getRepositoryToken(Renter));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a renter', async () => {
    const createRenterDto: CreateRenterDto = { name: 'John Doe' };
    const user: User = { id: '1', name: 'User' } as User;
    const renter: Renter = { id: '1', name: 'John Doe', user } as Renter;

    jest.spyOn(repository, 'create').mockReturnValue(renter);
    jest.spyOn(repository, 'save').mockResolvedValue(renter);

    expect(await service.create(createRenterDto, user)).toEqual(renter);
  });

  it('should find all renters from a user', async () => {
    const userId = '1';
    const renters: Renter[] = [
      { id: '1', name: 'John Doe', user: { id: '1' } as User },
    ] as Renter[];

    jest.spyOn(repository, 'find').mockResolvedValue(renters);

    expect(await service.findAllFromUser(userId)).toEqual(renters);
  });

  it('should find one renter by id', async () => {
    const id = '1';
    const renter: Renter = {
      id: '1',
      name: 'John Doe',
      user: { id: '1' } as User,
    } as Renter;

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(renter);

    expect(await service.findOne(id)).toEqual(renter);
  });

  it('should update a renter', async () => {
    const id = '1';
    const updateRenterDto: UpdateRenterDto = { name: 'Jane Doe' };
    const renter: Renter = {
      id: '1',
      name: 'Jane Doe',
      user: { id: '1' } as User,
    } as Renter;

    jest.spyOn(repository, 'update').mockResolvedValue(undefined);
    jest.spyOn(repository, 'findOneBy').mockResolvedValue(renter);

    expect(await service.update(id, updateRenterDto)).toEqual(renter);
  });

  it('should remove a renter', async () => {
    const id = '1';

    jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any);

    expect(await service.remove(id)).toEqual({ affected: 1 });
  });
});
