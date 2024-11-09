import { Test, TestingModule } from '@nestjs/testing';
import { TemplateService } from './template.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { User } from 'src/user/entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('TemplateService', () => {
  let templateService: TemplateService;

  const mockTemplateRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUser: User = {
    id: 'user1',
    email: 'test@user.com',
    password: 'hashedpassword',
  } as any; // Mock User entity

  const mockTemplate: Template = {
    id: 'template1',
    title: 'Template 1',
    content: 'Some content',
    user: mockUser,
  } as any; // Mock Template entity

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        {
          provide: getRepositoryToken(Template),
          useValue: mockTemplateRepository,
        },
      ],
    }).compile();

    templateService = module.get<TemplateService>(TemplateService);
  });

  describe('create', () => {
    it('should create and return a template', async () => {
      const createTemplateDto = {
        title: 'New Template',
        content: 'Template content',
      };

      mockTemplateRepository.create.mockReturnValue(mockTemplate);
      mockTemplateRepository.save.mockResolvedValue(mockTemplate);

      // @ts-expect-error - no need to pass all template properties
      const result = await templateService.create(createTemplateDto, mockUser);

      expect(result).toEqual(mockTemplate);
      expect(mockTemplateRepository.create).toHaveBeenCalledWith({
        ...createTemplateDto,
        user: mockUser,
      });
      expect(mockTemplateRepository.save).toHaveBeenCalledWith(mockTemplate);
    });
  });

  describe('findAllFromUser', () => {
    it('should return an array of templates for a user', async () => {
      const templates = [mockTemplate];
      mockTemplateRepository.find.mockResolvedValue(templates);

      const result = await templateService.findAllFromUser(mockUser.id);

      expect(result).toEqual(templates);
      expect(mockTemplateRepository.find).toHaveBeenCalledWith({
        where: { user: { id: mockUser.id } },
        relations: ['user'],
        order: { id: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a template by id', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(mockTemplate);

      const result = await templateService.findOne('template1');

      expect(result).toEqual(mockTemplate);
      expect(mockTemplateRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'template1' },
        relations: ['user'],
        order: { id: 'ASC' },
      });
    });

    it('should throw NotFoundException if template is not found', async () => {
      mockTemplateRepository.findOne.mockResolvedValue(null); // Template not found

      await expect(templateService.findOne('template1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update and return a template', async () => {
      const updateTemplateDto = { title: 'Updated Template' };
      const updatedTemplate = { ...mockTemplate, ...updateTemplateDto };

      mockTemplateRepository.update.mockResolvedValue(updatedTemplate);
      mockTemplateRepository.findOne.mockResolvedValue(updatedTemplate);

      const result = await templateService.update(
        'template1',
        updateTemplateDto,
      );

      expect(result).toEqual(updatedTemplate);
      expect(mockTemplateRepository.update).toHaveBeenCalledWith(
        'template1',
        updateTemplateDto,
      );
      expect(mockTemplateRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'template1' },
        relations: ['user'],
        order: { id: 'ASC' },
      });
    });
  });

  describe('remove', () => {
    it('should delete a template successfully', async () => {
      mockTemplateRepository.delete.mockResolvedValue({ affected: 1 });

      await expect(templateService.remove('template1')).resolves.not.toThrow();
      expect(mockTemplateRepository.delete).toHaveBeenCalledWith('template1');
    });

    it('should throw NotFoundException if template is not found to delete', async () => {
      mockTemplateRepository.delete.mockResolvedValue({ affected: 0 }); // No template affected

      await expect(templateService.remove('template1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
