import { Test, TestingModule } from '@nestjs/testing';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { LocationsService } from 'src/locations/locations.service';
import { RenterService } from 'src/renter/renter.service';
import { NotFoundException } from '@nestjs/common';
import { Rent } from './entities/rent.entity';
import { User } from 'src/user/entities/user.entity';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';

describe('RentController', () => {
  let rentController: RentController;

  const mockRentService = {
    create: jest.fn(),
    findAllFromUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockLocationsService = {
    findOne: jest.fn(),
  };

  const mockRenterService = {
    findOne: jest.fn(),
  };

  const mockUser: User = { id: 'user1', email: 'test@user.com' } as any; // mock User object

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentController],
      providers: [
        { provide: RentService, useValue: mockRentService },
        { provide: LocationsService, useValue: mockLocationsService },
        { provide: RenterService, useValue: mockRenterService },
      ],
    }).compile();

    rentController = module.get<RentController>(RentController);
  });

  describe('create', () => {
    it('should create a new rent successfully', async () => {
      const createRentDto: CreateRentDto = {
        id: 'rent1',
        initialDate: new Date(),
        endDate: new Date(),
        price: 1000,
        paymentDate: new Date(),
        active: true,
      };
      const renter = { id: 'renter1', name: 'Renter' };
      const location = { id: 'location1', name: 'Location' };

      mockRenterService.findOne.mockResolvedValue(renter);
      mockLocationsService.findOne.mockResolvedValue(location);
      mockRentService.create.mockResolvedValue({
        ...createRentDto,
        renter,
        location,
      });

      const result = await rentController.create(
        createRentDto,
        mockUser,
        renter.id,
        location.id,
      );

      expect(result).toEqual({ ...createRentDto, renter, location });
      expect(mockRentService.create).toHaveBeenCalledWith(
        createRentDto,
        renter,
        location,
        mockUser,
      );
    });

    it('should throw NotFoundException if renter is not found', async () => {
      const createRentDto: CreateRentDto = {
        id: 'rent1',
        initialDate: new Date(),
        endDate: new Date(),
        price: 1000,
        paymentDate: new Date(),
        active: true,
      };

      mockRenterService.findOne.mockResolvedValue(null); // Renter not found

      await expect(
        rentController.create(
          createRentDto,
          mockUser,
          'invalidRenterId',
          'locationId',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if location is not found', async () => {
      const createRentDto: CreateRentDto = {
        id: 'rent1',
        initialDate: new Date(),
        endDate: new Date(),
        price: 1000,
        paymentDate: new Date(),
        active: true,
      };
      const renter = { id: 'renter1', name: 'Renter' };

      mockRenterService.findOne.mockResolvedValue(renter);
      mockLocationsService.findOne.mockResolvedValue(null); // Location not found

      await expect(
        rentController.create(
          createRentDto,
          mockUser,
          renter.id,
          'invalidLocationId',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all rents for a user', async () => {
      const mockRents: Rent[] = [
        // @ts-expect-error - no need to pass all rent properties
        { id: 'rent1', price: 1000, active: true },
        // @ts-expect-error - no need to pass all rent properties
        { id: 'rent2', price: 1200, active: true },
      ];

      mockRentService.findAllFromUser.mockResolvedValue(mockRents);

      const result = await rentController.findAll(mockUser, { active: true });
      expect(result).toEqual(mockRents);
      expect(mockRentService.findAllFromUser).toHaveBeenCalledWith({
        userId: mockUser.id,
        active: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single rent by id', async () => {
      // @ts-expect-error - no need to pass all rent properties
      const mockRent: Rent = { id: 'rent1', price: 1000, active: true };

      mockRentService.findOne.mockResolvedValue(mockRent);

      const result = await rentController.findOne('rent1');
      expect(result).toEqual(mockRent);
      expect(mockRentService.findOne).toHaveBeenCalledWith('rent1');
    });
  });

  describe('update', () => {
    it('should update a rent successfully', async () => {
      const updateRentDto: UpdateRentDto = { price: 1100 };
      // @ts-expect-error - no need to pass all rent properties
      const updatedRent: Rent = { id: 'rent1', price: 1100, active: true };

      mockRentService.update.mockResolvedValue(updatedRent);

      const result = await rentController.update('rent1', updateRentDto);
      expect(result).toEqual(updatedRent);
      expect(mockRentService.update).toHaveBeenCalledWith(
        'rent1',
        updateRentDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a rent successfully', async () => {
      // @ts-expect-error - no need to pass all rent properties
      const rentToRemove: Rent = { id: 'rent1', price: 1000, active: true };

      mockRentService.remove.mockResolvedValue(rentToRemove);

      const result = await rentController.remove('rent1');
      expect(result).toEqual(rentToRemove);
      expect(mockRentService.remove).toHaveBeenCalledWith('rent1');
    });
  });
});
