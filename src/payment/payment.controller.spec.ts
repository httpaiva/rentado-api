import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RentService } from 'src/rent/rent.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { NotFoundException } from '@nestjs/common';
import { Payment } from './entities/payment.entity';
import { User } from 'src/user/entities/user.entity';

describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: PaymentService;
  let rentService: RentService;

  const mockPayment = {
    id: '1',
    paymentDate: new Date('2024-01-01'),
    referedMonth: 1,
    referedYear: 2024,
    value: 100,
  } as Payment;

  const mockRent = { id: '1' };

  const mockPaymentService = {
    create: jest.fn().mockResolvedValue(mockPayment),
    findAllFromRent: jest.fn().mockResolvedValue([mockPayment]),
    findOne: jest.fn().mockResolvedValue(mockPayment),
    update: jest.fn().mockResolvedValue(mockPayment),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  const mockRentService = {
    findOne: jest.fn().mockResolvedValue(mockRent),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        { provide: PaymentService, useValue: mockPaymentService },
        { provide: RentService, useValue: mockRentService },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
    rentService = module.get<RentService>(RentService);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment if rent exists', async () => {
      const createPaymentDto: CreatePaymentDto = {
        id: '1',
        paymentDate: new Date('2024-01-01'),
        referedMonth: 1,
        referedYear: 2024,
        value: 100,
      };
      const result = await controller.create(createPaymentDto, mockRent.id);

      expect(rentService.findOne).toHaveBeenCalledWith(mockRent.id);
      expect(paymentService.create).toHaveBeenCalledWith(
        createPaymentDto,
        mockRent,
      );
      expect(result).toEqual(mockPayment);
    });

    it('should throw NotFoundException if rent does not exist', async () => {
      jest.spyOn(rentService, 'findOne').mockResolvedValueOnce(null);

      const createPaymentDto: CreatePaymentDto = {
        id: '1',
        paymentDate: new Date('2024-01-01'),
        referedMonth: 1,
        referedYear: 2024,
        value: 100,
      };

      await expect(
        controller.create(createPaymentDto, 'non-existent-id'),
      ).rejects.toThrow(NotFoundException);
      expect(rentService.findOne).toHaveBeenCalledWith('non-existent-id');
      expect(paymentService.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all payments for a given rent and optional month/year', async () => {
      const userId = '1';
      const params = {
        rentId: '1',
        referedMonth: 1,
        referedYear: 2024,
      };
      const result = await controller.findAll({ id: userId } as User, params);

      expect(paymentService.findAllFromRent).toHaveBeenCalledWith(
        userId,
        params.rentId,
        params.referedMonth,
        params.referedYear,
      );
      expect(result).toEqual([mockPayment]);
    });
  });

  describe('findOne', () => {
    it('should return a single payment by id', async () => {
      const result = await controller.findOne('1');

      expect(paymentService.findOne).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockPayment);
    });
  });

  describe('update', () => {
    it('should update a payment and return the updated entity', async () => {
      const updatePaymentDto: UpdatePaymentDto = {
        paymentDate: new Date('2024-02-01'),
        referedMonth: 2,
        referedYear: 2024,
        value: 150,
      };
      const result = await controller.update('1', updatePaymentDto);

      expect(paymentService.update).toHaveBeenCalledWith('1', updatePaymentDto);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('remove', () => {
    it('should delete a payment by id and return the result', async () => {
      const result = await controller.remove('1');

      expect(paymentService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual({ affected: 1 });
    });
  });
});
