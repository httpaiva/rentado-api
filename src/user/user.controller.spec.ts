// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let userController: UserController;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser: User = {
    id: 'user1',
    email: 'test@user.com',
    password: 'hashedpassword',
  } as any; // Mock User entity

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@user.com',
        password: 'password123',
      };

      mockUserService.findOneByEmail.mockResolvedValue(null); // No existing user with this email
      mockUserService.create.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('salt');
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');

      const result = await userController.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashedpassword',
      });
    });

    it('should throw UnauthorizedException if email is already in use', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@user.com',
        password: 'password123',
      };

      mockUserService.findOneByEmail.mockResolvedValue(mockUser); // Email is already in use

      await expect(userController.create(createUserDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await userController.findAll();
      expect(result).toEqual(mockUsers);
      expect(mockUserService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await userController.findOne('user1');
      expect(result).toEqual(mockUser);
      expect(mockUserService.findOne).toHaveBeenCalledWith('user1');
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockUserService.findOne.mockResolvedValue(null); // User not found

      await expect(userController.findOne('user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = { email: 'new@user.com' };
      const updatedUser = { ...mockUser, email: 'new@user.com' };

      mockUserService.update.mockResolvedValue(updatedUser);

      const result = await userController.update('user1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(mockUserService.update).toHaveBeenCalledWith(
        'user1',
        updateUserDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      mockUserService.remove.mockResolvedValue({ affected: 1 });

      await expect(userController.remove('user1')).resolves.not.toThrow();
      expect(mockUserService.remove).toHaveBeenCalledWith('user1');
    });

    it('should throw NotFoundException if user is not found to delete', async () => {
      mockUserService.remove.mockResolvedValue({ affected: 0 }); // No user affected

      await expect(userController.remove('user1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
