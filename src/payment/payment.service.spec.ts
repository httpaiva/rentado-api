import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { Rent } from 'src/rent/entities/rent.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<Payment>;

  const mockPayment = {
    id: '1',
    paymentDate: new Date('2024-01-01'),
    referedMonth: 1,
    referedYear: 2024,
    value: 100,
    rent: { id: '1', user: { id: '1' } } as Rent,
  } as Payment;

  const mockRent = { id: '1', user: { id: '1' } } as Rent;

  const mockPaymentRepository = {
    create: jest.fn().mockReturnValue(mockPayment),
    save: jest.fn().mockResolvedValue(mockPayment),
    find: jest.fn().mockResolvedValue([mockPayment]),
    findOneBy: jest.fn().mockResolvedValue(mockPayment),
    update: jest.fn().mockResolvedValue({ affected: 1 }),
    delete: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get<Repository<Payment>>(
      getRepositoryToken(Payment),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and save a new payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        id: '1',
        paymentDate: new Date('2024-01-01'),
        referedMonth: 1,
        referedYear: 2024,
        value: 100,
      };
      const result = await service.create(createPaymentDto, mockRent);

      expect(paymentRepository.create).toHaveBeenCalledWith({
        ...createPaymentDto,
        rent: mockRent,
      });
      expect(paymentRepository.save).toHaveBeenCalledWith(mockPayment);
      expect(result).toEqual(mockPayment);
    });
  });

  describe('findAllFromRent', () => {
    it('should return all payments for a given rent and optional month/year', async () => {
      const userId = '1';
      const rentId = '1';
      const result = await service.findAllFromRent(userId, rentId, 1, 2024);

      expect(paymentRepository.find).toHaveBeenCalledWith({
        where: {
          rent: { id: rentId, user: { id: '1' } },
          referedMonth: 1,
          referedYear: 2024,
        },
        relations: ['rent', 'rent.location', 'rent.renter', 'rent.user'],
        order: { id: 'ASC' },
      });
      expect(result).toEqual([mockPayment]);
    });
  });

  describe('findOne', () => {
    it('should return a single payment by id', async () => {
      const result = await service.findOne('1');

      expect(paymentRepository.find).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['rent', 'rent.location', 'rent.renter'],
        order: { id: 'ASC' },
      });
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
      const result = await service.update('1', updatePaymentDto);

      expect(paymentRepository.update).toHaveBeenCalledWith(
        '1',
        updatePaymentDto,
      );
      expect(paymentRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect(result).toEqual(mockPayment);
    });
  });

  describe('remove', () => {
    it('should delete a payment by id and return the result', async () => {
      const result = await service.remove('1');

      expect(paymentRepository.delete).toHaveBeenCalledWith('1');
      expect(result).toEqual({ affected: 1 });
    });
  });
});
