// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { LocationsService } from 'src/locations/locations.service';
import { RenterService } from 'src/renter/renter.service';
import { BadRequestException } from '@nestjs/common';
import { CreateRentDto } from './dto/create-rent.dto';
import { UpdateRentDto } from './dto/update-rent.dto';
import { User } from 'src/user/entities/user.entity';

describe('RentController', () => {
  let controller: RentController;
  let rentService: RentService;

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

  const mockUser = {
    id: 'user1',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentController],
      providers: [
        { provide: RentService, useValue: mockRentService },
        { provide: LocationsService, useValue: mockLocationsService },
        { provide: RenterService, useValue: mockRenterService },
      ],
    }).compile();

    controller = module.get<RentController>(RentController);
    rentService = module.get<RentService>(RentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should throw BadRequestException if renter or location are not provided', async () => {
      const createRentDto: CreateRentDto = {
        renter: undefined,
        location: undefined,
        initialDate: '2024-11-01',
        endDate: '2024-11-30',
        paymentDate: '2024-11-05',
      };

      await expect(controller.create(createRentDto, mockUser)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a new rent', async () => {
      const createRentDto: CreateRentDto = {
        renter: { id: 'renter1' },
        location: { id: 'location1' },
        initialDate: '2024-11-01',
        endDate: '2024-11-30',
        paymentDate: '2024-11-05',
      };

      const newRent = { ...createRentDto, id: 'rent1' };

      mockRentService.create.mockResolvedValue(newRent);

      const result = await controller.create(createRentDto, mockUser);

      expect(result).toEqual(newRent);
      expect(rentService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createRentDto,
          initialDate: expect.any(Date),
          endDate: expect.any(Date),
          paymentDate: expect.any(Date),
        }),
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of rents', async () => {
      const rents = [{ id: 'rent1' }, { id: 'rent2' }];
      mockRentService.findAllFromUser.mockResolvedValue(rents);

      const result = await controller.findAll(mockUser, { active: true });

      expect(result).toEqual(rents);
      expect(rentService.findAllFromUser).toHaveBeenCalledWith({
        userId: mockUser.id,
        active: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return a rent by id', async () => {
      const rent = { id: 'rent1' };
      mockRentService.findOne.mockResolvedValue(rent);

      const result = await controller.findOne('rent1');

      expect(result).toEqual(rent);
      expect(rentService.findOne).toHaveBeenCalledWith('rent1');
    });
  });

  describe('update', () => {
    it('should update and return a rent', async () => {
      const updateRentDto: UpdateRentDto = { paymentDate: '2024-11-10' };
      const updatedRent = { id: 'rent1', ...updateRentDto };
      mockRentService.update.mockResolvedValue(updatedRent);

      const result = await controller.update('rent1', updateRentDto);

      expect(result).toEqual(updatedRent);
      expect(rentService.update).toHaveBeenCalledWith('rent1', updateRentDto);
    });
  });

  describe('remove', () => {
    it('should delete a rent', async () => {
      const deleteResult = { affected: 1 };
      mockRentService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove('rent1');

      expect(result).toEqual(deleteResult);
      expect(rentService.remove).toHaveBeenCalledWith('rent1');
    });
  });
});
