import { Test, TestingModule } from '@nestjs/testing';
import { LocationsController } from './locations.controller';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { User } from 'src/user/entities/user.entity';

describe('LocationsController', () => {
  let controller: LocationsController;
  let service: LocationsService;

  //@ts-expect-error - no need to pass all location properties
  const mockLocation: Location = {
    id: '1',
    name: 'Location 1',
    rents: [],
    user: { id: '1' } as User,
  };
  const mockUser: User = { id: '1' } as User;

  const mockLocationsService = {
    findAllFromUser: jest.fn().mockResolvedValue([mockLocation]),
    findAllAvailable: jest.fn().mockResolvedValue([mockLocation]),
    findOne: jest.fn().mockResolvedValue(mockLocation),
    create: jest.fn().mockResolvedValue(mockLocation),
    update: jest.fn().mockResolvedValue(mockLocation),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useValue: mockLocationsService,
        },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of locations for the user', async () => {
      const result = await controller.findAll(mockUser);
      expect(result).toEqual([mockLocation]);
      expect(service.findAllFromUser).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findAllAvailable', () => {
    it('should return an array of available locations for the user', async () => {
      const result = await controller.findAllAvailable(mockUser);
      expect(result).toEqual([mockLocation]);
      expect(service.findAllAvailable).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('findOne', () => {
    it('should return a single location by id', async () => {
      const result = await controller.findOne('1');
      expect(result).toEqual(mockLocation);
      expect(service.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('create', () => {
    it('should create a new location for the user', async () => {
      // @ts-expect-error - no need to pass all location properties
      const createLocationDto: CreateLocationDto = { name: 'New Location' };
      const result = await controller.create(createLocationDto, mockUser);
      expect(result).toEqual(mockLocation);
      expect(service.create).toHaveBeenCalledWith(createLocationDto, mockUser);
    });
  });

  describe('update', () => {
    it('should update a location and return the updated entity', async () => {
      const updateLocationDto: UpdateLocationDto = { name: 'Updated Location' };
      const result = await controller.update('1', updateLocationDto);
      expect(result).toEqual(mockLocation);
      expect(service.update).toHaveBeenCalledWith('1', updateLocationDto);
    });
  });

  describe('remove', () => {
    it('should delete a location by id and return the result', async () => {
      const result = await controller.remove('1');
      expect(result).toEqual({ affected: 1 });
      expect(service.remove).toHaveBeenCalledWith('1');
    });
  });
});
