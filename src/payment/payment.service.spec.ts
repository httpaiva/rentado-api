import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Rent } from 'src/rent/entities/rent.entity';

describe('PaymentService', () => {
  let service: PaymentService;
  let paymentRepository: Repository<Payment>;

  const mockPaymentRepository = {
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
    it('should create and save a payment', async () => {
      const rent: Rent = {
        id: 'rent1',
        initialDate: new Date(),
        endDate: new Date(),
        price: 1000,
        paymentDate: new Date(),
        active: true,
        // @ts-expect-error - not needed
        renter: {
          id: 'renter1',
          firstName: 'John',
          lastName: 'Doe',
          document_cpf: '12345678901',
        },
        // @ts-expect-error - not needed
        location: {
          id: 'location1',
          name: 'Apartment',
          country: 'Brazil',
          state: 'RJ',
          city: 'Rio',
          neighborhood: 'Copacabana',
          street: 'Street A',
          number: '100',
          postalCode: '22000-000',
        },
      };

      const createPaymentDto: CreatePaymentDto = {
        id: 'payment1',
        paymentDate: new Date(),
        referedMonth: 11,
        referedYear: 2024,
        value: 100,
        rent: rent,
      };

      const createdPayment = { ...createPaymentDto, id: 'payment1' };

      mockPaymentRepository.create.mockReturnValue(createdPayment);
      mockPaymentRepository.save.mockResolvedValue(createdPayment);

      const result = await service.create(createPaymentDto);

      expect(result).toEqual(createdPayment);
      expect(paymentRepository.create).toHaveBeenCalledWith(createPaymentDto);
      expect(paymentRepository.save).toHaveBeenCalledWith(createdPayment);
    });
  });

  describe('findAllFromRent', () => {
    it('should return an array of payments for a specific rent', async () => {
      const payments = [
        { id: 'payment1', rent: { id: 'rent1' }, value: 100 },
        { id: 'payment2', rent: { id: 'rent1' }, value: 200 },
      ];

      const userId = 'user1';
      const rentId = 'rent1';
      const referedMonth = 11;
      const referedYear = 2024;

      mockPaymentRepository.find.mockResolvedValue(payments);

      const result = await service.findAllFromRent(
        userId,
        rentId,
        referedMonth,
        referedYear,
      );

      expect(result).toEqual(payments);
      expect(paymentRepository.find).toHaveBeenCalledWith({
        where: {
          rent: { id: rentId, user: { id: userId } },
          referedMonth,
          referedYear,
        },
        relations: ['rent', 'rent.location', 'rent.renter', 'rent.user'],
        order: { id: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a payment by id', async () => {
      const payment = { id: 'payment1', value: 100, rent: { id: 'rent1' } };
      mockPaymentRepository.find.mockResolvedValue([payment]);

      const result = await service.findOne('payment1');

      expect(result).toEqual(payment);
      expect(paymentRepository.find).toHaveBeenCalledWith({
        where: { id: 'payment1' },
        relations: ['rent', 'rent.location', 'rent.renter'],
        order: { id: 'ASC' },
      });
    });

    it('should return null if payment is not found', async () => {
      mockPaymentRepository.find.mockResolvedValue([]);

      const result = await service.findOne('payment1');

      expect(result).toBe(undefined);
    });
  });

  describe('update', () => {
    it('should update and return the updated payment', async () => {
      const updatePaymentDto = { value: 150 };
      const updatedPayment = { id: 'payment1', ...updatePaymentDto };

      mockPaymentRepository.update.mockResolvedValue({});
      mockPaymentRepository.findOneBy.mockResolvedValue(updatedPayment);

      const result = await service.update('payment1', updatePaymentDto);

      expect(result).toEqual(updatedPayment);
      expect(paymentRepository.update).toHaveBeenCalledWith(
        'payment1',
        updatePaymentDto,
      );
      expect(paymentRepository.findOneBy).toHaveBeenCalledWith({
        id: 'payment1',
      });
    });
  });

  describe('remove', () => {
    it('should delete a payment', async () => {
      const deleteResult = { affected: 1 };

      mockPaymentRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove('payment1');

      expect(result).toEqual(deleteResult);
      expect(paymentRepository.delete).toHaveBeenCalledWith('payment1');
    });

    it('should not delete a payment and return 0 affected', async () => {
      const deleteResult = { affected: 0 };

      mockPaymentRepository.delete.mockResolvedValue(deleteResult);

      const result = await service.remove('payment1');

      expect(result).toEqual(deleteResult);
      expect(paymentRepository.delete).toHaveBeenCalledWith('payment1');
    });
  });
});
