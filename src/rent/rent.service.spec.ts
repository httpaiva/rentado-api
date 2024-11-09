import { Test, TestingModule } from '@nestjs/testing';
import { RentService } from './rent.service';
import { Rent } from './entities/rent.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Renter } from 'src/renter/entities/renter.entity';
import { Location } from 'src/locations/entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateRentDto } from './dto/create-rent.dto';

describe('RentService', () => {
  let service: RentService;

  const mockRentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockRenter = { id: 'renter-id' } as Renter;
  const mockLocation = { id: 'location-id' } as Location;
  const mockUser = { id: 'user-id' } as User;
  const mockCreateRentDto: CreateRentDto = {
    id: 'rent-id',
    initialDate: new Date(),
    endDate: new Date(),
    price: 1000,
    paymentDate: new Date(),
    active: true,
    renter: mockRenter,
    location: mockLocation,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RentService,
        {
          provide: getRepositoryToken(Rent),
          useValue: mockRentRepository,
        },
      ],
    }).compile();

    service = module.get<RentService>(RentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new rent', async () => {
    const rent = {
      ...mockCreateRentDto,
      renter: mockRenter,
      location: mockLocation,
      user: mockUser,
    };
    mockRentRepository.create.mockReturnValue(rent);
    mockRentRepository.save.mockResolvedValue(rent);

    const result = await service.create(mockCreateRentDto, mockUser);

    expect(mockRentRepository.create).toHaveBeenCalledWith({
      ...mockCreateRentDto,
      renter: mockRenter,
      location: mockLocation,
      user: mockUser,
    });
    expect(mockRentRepository.save).toHaveBeenCalledWith(rent);
    expect(result).toEqual(rent);
  });

  it('should return a list of rents for a user', async () => {
    const rents = [
      { ...mockCreateRentDto, id: 'rent-id-1' },
      { ...mockCreateRentDto, id: 'rent-id-2' },
    ];
    mockRentRepository.find.mockResolvedValue(rents);

    const result = await service.findAllFromUser({ userId: 'user-id' });

    expect(mockRentRepository.find).toHaveBeenCalledWith({
      where: { user: { id: 'user-id' } },
      relations: ['user', 'renter', 'location'],
      order: { id: 'ASC' },
    });
    expect(result).toEqual(rents);
  });

  it('should return a list of rents filtered by active status', async () => {
    const rents = [{ ...mockCreateRentDto, id: 'rent-id-1' }];
    mockRentRepository.find.mockResolvedValue(rents);

    const result = await service.findAllFromUser({
      userId: 'user-id',
      active: true,
    });

    expect(mockRentRepository.find).toHaveBeenCalledWith({
      where: { user: { id: 'user-id' }, active: true },
      relations: ['user', 'renter', 'location'],
      order: { id: 'ASC' },
    });
    expect(result).toEqual(rents);
  });

  it('should return a single rent by id', async () => {
    const rent = { ...mockCreateRentDto, id: 'rent-id' };
    mockRentRepository.findOne.mockResolvedValue(rent);

    const result = await service.findOne('rent-id');

    expect(mockRentRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'rent-id' },
      relations: ['renter', 'location'],
      order: { id: 'ASC' },
    });
    expect(result).toEqual(rent);
  });

  it('should return null if rent is not found', async () => {
    mockRentRepository.findOne.mockResolvedValue(null);

    const result = await service.findOne('invalid-rent-id');

    expect(mockRentRepository.findOne).toHaveBeenCalledWith({
      where: { id: 'invalid-rent-id' },
      relations: ['renter', 'location'],
      order: { id: 'ASC' },
    });
    expect(result).toBeNull();
  });

  it('should update a rent', async () => {
    const updatedRent = { ...mockCreateRentDto, price: 1200 };
    mockRentRepository.update.mockResolvedValue(undefined);
    mockRentRepository.findOne.mockResolvedValue(updatedRent);

    const result = await service.update('rent-id', { price: 1200 });

    expect(mockRentRepository.update).toHaveBeenCalledWith('rent-id', {
      price: 1200,
    });
    expect(mockRentRepository.findOne).toHaveBeenCalledWith({
      relations: ['renter', 'location'],
      where: { id: 'rent-id' },
    });
    expect(result).toEqual(updatedRent);
  });

  it('should delete a rent', async () => {
    mockRentRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await service.remove('rent-id');

    expect(mockRentRepository.delete).toHaveBeenCalledWith('rent-id');
    expect(result).toEqual({ affected: 1 });
  });

  it('should return { affected: 0 } if rent is not found', async () => {
    mockRentRepository.delete.mockResolvedValue({ affected: 0 });

    const result = await service.remove('invalid-rent-id');

    expect(mockRentRepository.delete).toHaveBeenCalledWith('invalid-rent-id');
    expect(result).toEqual({ affected: 0 });
  });
});
