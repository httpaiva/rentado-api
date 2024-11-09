import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';
import { RentService } from 'src/rent/rent.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';

describe('TemplateController', () => {
  let controller: TemplateController;
  let templateService: TemplateService;
  let rentService: RentService;

  beforeEach(async () => {
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

    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        { provide: TemplateService, useValue: mockTemplateService },
        { provide: RentService, useValue: mockRentService },
      ],
    }).compile();

    controller = module.get<TemplateController>(TemplateController);
    templateService = module.get<TemplateService>(TemplateService);
    rentService = module.get<RentService>(RentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new template', async () => {
      // @ts-expect-error - no need to pass all template properties
      const createTemplateDto: CreateTemplateDto = {
        title: 'Template 1',
        content: 'Hello {{user_firstName}}',
      };
      const user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
      } as User;
      const mockTemplate = {
        ...createTemplateDto,
        user,
      };

      templateService.create = jest.fn().mockResolvedValue(mockTemplate);

      const result = await controller.create(createTemplateDto, user);

      expect(result).toEqual(mockTemplate);
      expect(templateService.create).toHaveBeenCalledWith(
        createTemplateDto,
        user,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of templates for the user', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
      } as User;
      const mockTemplates = [
        { id: '1', name: 'Template 1', content: 'Hello {{user_firstName}}' },
        { id: '2', name: 'Template 2', content: 'Hi {{user_firstName}}' },
      ];

      templateService.findAllFromUser = jest
        .fn()
        .mockResolvedValue(mockTemplates);

      const result = await controller.findAll(user);

      expect(result).toEqual(mockTemplates);
      expect(templateService.findAllFromUser).toHaveBeenCalledWith(user.id);
    });
  });

  describe('findOne', () => {
    it('should return a template by id', async () => {
      const templateId = '1';
      const mockTemplate = {
        id: templateId,
        name: 'Template 1',
        content: 'Hello {{user_firstName}}',
      };

      templateService.findOne = jest.fn().mockResolvedValue(mockTemplate);

      const result = await controller.findOne(templateId);

      expect(result).toEqual(mockTemplate);
      expect(templateService.findOne).toHaveBeenCalledWith(templateId);
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '1';

      templateService.findOne = jest.fn().mockResolvedValue(null);

      await expect(controller.findOne(templateId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe.skip('translate', () => {
    it('should return a translated template', async () => {
      const templateId = '1';
      const rentId = '123';
      const mockTemplate = {
        id: templateId,
        content: 'Hello {{user_firstName}}',
      };
      const mockRent = {
        id: rentId,
        location: { name: 'Location 1' },
        renter: { firstName: 'John' },
      };
      const mockTranslatedTemplate = { ...mockTemplate, content: 'Hello John' };

      templateService.findOne = jest.fn().mockResolvedValue(mockTemplate);
      rentService.findOne = jest.fn().mockResolvedValue(mockRent);

      const result = await controller.translate(
        { id: templateId },
        { rent_id: rentId },
      );

      expect(result).toEqual(mockTranslatedTemplate);
      expect(templateService.findOne).toHaveBeenCalledWith(templateId);
      expect(rentService.findOne).toHaveBeenCalledWith(rentId);
    });

    it('should throw BadRequestException if rent_id is missing', async () => {
      await expect(
        controller.translate({ id: '1' }, { rent_id: '' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if template not found', async () => {
      const templateId = '1';
      const rentId = '123';

      templateService.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        controller.translate({ id: templateId }, { rent_id: rentId }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if rent not found', async () => {
      const templateId = '1';
      const rentId = '123';
      const mockTemplate = {
        id: templateId,
        content: 'Hello {{user_firstName}}',
      };

      templateService.findOne = jest.fn().mockResolvedValue(mockTemplate);
      rentService.findOne = jest.fn().mockResolvedValue(null);

      await expect(
        controller.translate({ id: templateId }, { rent_id: rentId }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a template', async () => {
      const templateId = '1';
      const updateTemplateDto: UpdateTemplateDto = {
        title: 'Updated Template',
      };
      const mockTemplate = { id: templateId, ...updateTemplateDto };

      templateService.update = jest.fn().mockResolvedValue(mockTemplate);

      const result = await controller.update(templateId, updateTemplateDto);

      expect(result).toEqual(mockTemplate);
      expect(templateService.update).toHaveBeenCalledWith(
        templateId,
        updateTemplateDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a template', async () => {
      const templateId = '1';

      templateService.remove = jest.fn().mockResolvedValue({ affected: 1 });

      await controller.remove(templateId);

      expect(templateService.remove).toHaveBeenCalledWith(templateId);
    });
  });
});
