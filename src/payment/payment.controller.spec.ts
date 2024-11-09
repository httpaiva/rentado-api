import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { User } from 'src/user/entities/user.entity';

describe('PaymentController', () => {
  let controller: PaymentController;

  const mockPaymentService = {
    create: jest.fn(),
    findAllFromRent: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // @ts-expect-error - not needed
  const mockUser: User = {
    id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    document_cpf: '12345678901',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockPaymentService,
        },
      ],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call PaymentService.create and return the created payment', async () => {
      const createPaymentDto: CreatePaymentDto = {
        id: 'payment1',
        paymentDate: new Date(),
        referedMonth: 11,
        referedYear: 2024,
        value: 100,
        // @ts-expect-error - not needed
        rent: {
          id: 'rent1',
          initialDate: new Date(),
          endDate: new Date(),
          price: 1000,
          paymentDate: new Date(),
          active: true,
        },
      };

      const createdPayment = { ...createPaymentDto, id: 'payment1' };
      mockPaymentService.create.mockResolvedValue(createdPayment);

      const result = await controller.create(createPaymentDto);

      expect(result).toEqual(createdPayment);
      expect(mockPaymentService.create).toHaveBeenCalledWith(createPaymentDto);
    });
  });

  describe('findAll', () => {
    it('should call PaymentService.findAllFromRent and return an array of payments', async () => {
      const payments = [
        { id: 'payment1', rent: { id: 'rent1' }, value: 100 },
        { id: 'payment2', rent: { id: 'rent1' }, value: 200 },
      ];

      const params = { rentId: 'rent1', referedMonth: 11, referedYear: 2024 };

      mockPaymentService.findAllFromRent.mockResolvedValue(payments);

      const result = await controller.findAll(mockUser, params);

      expect(result).toEqual(payments);
      expect(mockPaymentService.findAllFromRent).toHaveBeenCalledWith(
        mockUser.id,
        params.rentId,
        params.referedMonth,
        params.referedYear,
      );
    });
  });

  describe('findOne', () => {
    it('should call PaymentService.findOne and return the payment', async () => {
      const payment = { id: 'payment1', rent: { id: 'rent1' }, value: 100 };

      mockPaymentService.findOne.mockResolvedValue(payment);

      const result = await controller.findOne('payment1');

      expect(result).toEqual(payment);
      expect(mockPaymentService.findOne).toHaveBeenCalledWith('payment1');
    });
  });

  describe('update', () => {
    it('should call PaymentService.update and return the updated payment', async () => {
      const updatePaymentDto: UpdatePaymentDto = { value: 150 };
      const updatedPayment = { id: 'payment1', ...updatePaymentDto };

      mockPaymentService.update.mockResolvedValue(updatedPayment);

      const result = await controller.update('payment1', updatePaymentDto);

      expect(result).toEqual(updatedPayment);
      expect(mockPaymentService.update).toHaveBeenCalledWith(
        'payment1',
        updatePaymentDto,
      );
    });
  });

  describe('remove', () => {
    it('should call PaymentService.remove and return the result of deletion', async () => {
      const deleteResult = { affected: 1 };

      mockPaymentService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove('payment1');

      expect(result).toEqual(deleteResult);
      expect(mockPaymentService.remove).toHaveBeenCalledWith('payment1');
    });

    it('should return a result with 0 affected if no payment was found', async () => {
      const deleteResult = { affected: 0 };

      mockPaymentService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove('payment1');

      expect(result).toEqual(deleteResult);
      expect(mockPaymentService.remove).toHaveBeenCalledWith('payment1');
    });
  });
});
