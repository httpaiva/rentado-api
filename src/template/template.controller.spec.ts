import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { RentService } from 'src/rent/rent.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import * as Mustache from 'mustache';
import { parseDynamicFields } from 'src/utils/functions/parseDynamicFields';
import { User } from 'src/user/entities/user.entity';

describe('TemplateController', () => {
  let controller: TemplateController;

  const mockTemplateService = {
    create: jest.fn(),
    findAllFromUser: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockRentService = {
    findOne: jest.fn(),
  };

  const mockUser = {
    id: 'user1',
    firstName: 'John',
    lastName: 'Doe',
    document_cpf: '12345678901',
    email: 'john@example.com',
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        { provide: TemplateService, useValue: mockTemplateService },
        { provide: RentService, useValue: mockRentService },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call TemplateService.create and return the created template', async () => {
      const createTemplateDto: CreateTemplateDto = {
        id: 'template1',
        title: 'New Template',
        content: 'Template content',
      };

      const createdTemplate = { ...createTemplateDto, id: 'template1' };
      mockTemplateService.create.mockReturnValue(createdTemplate);

      const result = await controller.create(createTemplateDto, mockUser);

      expect(result).toEqual(createdTemplate);
      expect(mockTemplateService.create).toHaveBeenCalledWith(
        createTemplateDto,
        mockUser,
      );
    });
  });

  describe('findAll', () => {
    it('should return all templates for a user', async () => {
      const templates = [{ id: 'template1' }, { id: 'template2' }];
      mockTemplateService.findAllFromUser.mockResolvedValue(templates);

      const result = await controller.findAll(mockUser);

      expect(result).toEqual(templates);
      expect(mockTemplateService.findAllFromUser).toHaveBeenCalledWith(
        mockUser.id,
      );
    });
  });

  describe('findOne', () => {
    it('should return a template by ID', async () => {
      const template = { id: 'template1', content: 'Template content' };
      mockTemplateService.findOne.mockResolvedValue(template);

      const result = await controller.findOne(mockUser, { id: 'template1' });

      expect(result).toEqual(template);
      expect(mockTemplateService.findOne).toHaveBeenCalledWith(
        'template1',
        mockUser.id,
      );
    });

    it('should throw NotFoundException if template is not found', async () => {
      mockTemplateService.findOne.mockResolvedValue(null);

      await expect(
        controller.findOne(mockUser, { id: 'template1' }),
      ).rejects.toThrow(
        new NotFoundException(`Template with id template1 not found`),
      );
    });
  });

  describe.skip('translate', () => {
    const mockRent = {
      location: {
        name: 'Location name',
        country: 'Country',
      },
      initialDate: new Date(),
      endDate: new Date(),
      price: 1000,
      paymentDate: new Date(),
      renter: { firstName: 'Renter' },
    };

    it('should return a translated template', async () => {
      const template = {
        id: 'template1',
        content: 'Hello, {{user_firstName}} from {{location_name}}',
        user: mockUser,
      };
      const expectedContent = 'Hello, John from Location name';

      mockTemplateService.findOne.mockResolvedValue(template);
      mockRentService.findOne.mockResolvedValue(mockRent);
      jest.spyOn(Mustache, 'render').mockReturnValue(expectedContent);

      const result = await controller.translate(
        mockUser,
        { id: 'template1' },
        { rent_id: 'rent1' },
      );

      expect(result.content).toEqual(expectedContent);
      expect(Mustache.render).toHaveBeenCalledWith(
        parseDynamicFields(template.content),
        expect.objectContaining({
          user_firstName: mockUser.firstName,
          location_name: mockRent.location.name,
        }),
      );
    });

    it('should throw BadRequestException if rent_id is missing', async () => {
      await expect(
        controller.translate(mockUser, { id: 'template1' }, { rent_id: '' }),
      ).rejects.toThrow(new BadRequestException('Invalid parameters'));
    });

    it('should throw NotFoundException if template is not found', async () => {
      mockTemplateService.findOne.mockResolvedValue(null);

      await expect(
        controller.translate(
          mockUser,
          { id: 'template1' },
          { rent_id: 'rent1' },
        ),
      ).rejects.toThrow(new NotFoundException('Template not found'));
    });

    it('should throw NotFoundException if rent is not found', async () => {
      const template = { id: 'template1', content: 'Content', user: mockUser };
      mockTemplateService.findOne.mockResolvedValue(template);
      mockRentService.findOne.mockResolvedValue(null);

      await expect(
        controller.translate(
          mockUser,
          { id: 'template1' },
          { rent_id: 'rent1' },
        ),
      ).rejects.toThrow(new NotFoundException('Rent not found'));
    });
  });

  describe('update', () => {
    it('should update a template', async () => {
      const updateTemplateDto: UpdateTemplateDto = {
        content: 'Updated content',
      };
      const updatedTemplate = { id: 'template1', ...updateTemplateDto };

      mockTemplateService.update.mockResolvedValue(updatedTemplate);

      const result = await controller.update('template1', updateTemplateDto);

      expect(result).toEqual(updatedTemplate);
      expect(mockTemplateService.update).toHaveBeenCalledWith(
        'template1',
        updateTemplateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a template', async () => {
      const deleteResult = { affected: 1 };

      mockTemplateService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove('template1');

      expect(result).toEqual(deleteResult);
      expect(mockTemplateService.remove).toHaveBeenCalledWith('template1');
    });

    it('should return result with affected = 0 if no template was found', async () => {
      const deleteResult = { affected: 0 };

      mockTemplateService.remove.mockResolvedValue(deleteResult);

      const result = await controller.remove('template1');

      expect(result).toEqual(deleteResult);
      expect(mockTemplateService.remove).toHaveBeenCalledWith('template1');
    });
  });
});
