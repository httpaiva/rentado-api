// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { RenterController } from './renter.controller';
import { RenterService } from './renter.service';
import { CreateRenterDto } from './dto/create-renter.dto';
import { UpdateRenterDto } from './dto/update-renter.dto';
import { User } from 'src/user/entities/user.entity';
import { Renter } from './entities/renter.entity';

describe('RenterController', () => {
  let controller: RenterController;
  let service: RenterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RenterController],
      providers: [
        {
          provide: RenterService,
          useValue: {
            findAllFromUser: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RenterController>(RenterController);
    service = module.get<RenterService>(RenterService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all renters for a user', async () => {
    const user: User = { id: '1', name: 'User' } as User;
    const renters: Renter[] = [{ id: '1', name: 'John Doe', user }] as Renter[];
    jest.spyOn(service, 'findAllFromUser').mockResolvedValue(renters);

    expect(await controller.findAll(user)).toEqual(renters);
  });

  it('should return a single renter by id', async () => {
    const renter: Renter = {
      id: '1',
      name: 'John Doe',
      user: { id: '1' } as User,
    } as Renter;
    jest.spyOn(service, 'findOne').mockResolvedValue(renter);

    expect(await controller.findOne('1')).toEqual(renter);
  });

  it('should create a new renter', async () => {
    const createRenterDto: CreateRenterDto = { name: 'John Doe' };
    const user: User = { id: '1', name: 'User' } as User;
    const renter: Renter = { id: '1', name: 'John Doe', user } as Renter;
    jest.spyOn(service, 'create').mockResolvedValue(renter);

    expect(await controller.create(createRenterDto, user)).toEqual(renter);
  });

  it('should update a renter', async () => {
    const updateRenterDto: UpdateRenterDto = { name: 'Jane Doe' };
    const renter: Renter = {
      id: '1',
      name: 'Jane Doe',
      user: { id: '1' } as User,
    } as Renter;
    jest.spyOn(service, 'update').mockResolvedValue(renter);

    expect(await controller.update('1', updateRenterDto)).toEqual(renter);
  });

  it('should remove a renter', async () => {
    jest.spyOn(service, 'remove').mockResolvedValue({ affected: 1 } as any);

    expect(await controller.remove('1')).toEqual({ affected: 1 });
  });
});
