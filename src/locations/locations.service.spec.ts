import { Test, TestingModule } from '@nestjs/testing';
import { LocationsService } from './locations.service';
import { Location } from './entities/location.entity';
import { User } from 'src/user/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('LocationsService', () => {
  let service: LocationsService;

  const mockLocationsRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        {
          provide: getRepositoryToken(Location),
          useValue: mockLocationsRepository,
        },
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create and save a new location', async () => {
      const createLocationDto = { name: 'Test Location' };
      const user = new User();
      const location = new Location();
      mockLocationsRepository.create.mockReturnValue(location);
      mockLocationsRepository.save.mockResolvedValue(location);

      //@ts-expect-error - no need to pass all location properties
      const result = await service.create(createLocationDto, user);

      expect(mockLocationsRepository.create).toHaveBeenCalledWith({
        ...createLocationDto,
        user,
      });
      expect(mockLocationsRepository.save).toHaveBeenCalledWith(location);
      expect(result).toBe(location);
    });
  });

  describe('findAllFromUser', () => {
    it('should return all locations for a user', async () => {
      const userId = '1';
      const locations = [new Location()];
      mockLocationsRepository.find.mockResolvedValue(locations);

      const result = await service.findAllFromUser(userId);

      expect(mockLocationsRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
        order: { id: 'ASC' },
      });
      expect(result).toBe(locations);
    });
  });

  describe('findAllAvailable', () => {
    it('should return locations where all rents have active=false or have no rents', async () => {
      const userId = '1';
      const locations = [
        { rents: [{ active: false }] },
        { rents: [{ active: false }, { active: false }] },
        { rents: [{ active: true }] },
        { rents: [] },
      ] as Location[];
      const expectedLocations = [locations[0], locations[1], locations[3]];

      mockLocationsRepository.find.mockResolvedValue(locations);

      const result = await service.findAllAvailable(userId);

      expect(mockLocationsRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user', 'rents'],
        order: { id: 'ASC' },
      });
      expect(result).toEqual(expectedLocations);
    });
  });

  describe('findOne', () => {
    it('should return a location by id', async () => {
      const locationId = '1';
      const location = new Location();
      mockLocationsRepository.findOneBy.mockResolvedValue(location);

      const result = await service.findOne(locationId);

      expect(mockLocationsRepository.findOneBy).toHaveBeenCalledWith({
        id: locationId,
      });
      expect(result).toBe(location);
    });
  });

  describe('update', () => {
    it('should update a location and return the updated entity', async () => {
      const locationId = '1';
      const updateLocationDto = { name: 'Updated Location' };
      const updatedLocation = new Location();
      mockLocationsRepository.update.mockResolvedValue(null);
      mockLocationsRepository.findOneBy.mockResolvedValue(updatedLocation);

      const result = await service.update(locationId, updateLocationDto);

      expect(mockLocationsRepository.update).toHaveBeenCalledWith(
        locationId,
        updateLocationDto,
      );
      expect(mockLocationsRepository.findOneBy).toHaveBeenCalledWith({
        id: locationId,
      });
      expect(result).toBe(updatedLocation);
    });
  });

  describe('remove', () => {
    it('should delete a location by id', async () => {
      const locationId = '1';
      mockLocationsRepository.delete.mockResolvedValue(null);

      await service.remove(locationId);

      expect(mockLocationsRepository.delete).toHaveBeenCalledWith(locationId);
    });
  });
});
