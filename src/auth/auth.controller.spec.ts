import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthController', () => {
  let authController: AuthController;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findOneByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const signInDto = { email: 'test@example.com', password: 'password123' };

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedpassword123',
      };

      const mockToken = 'mocked-jwt-token';

      // Mocking the UserService's method
      userService.findOneByEmail = jest.fn().mockResolvedValue(mockUser);
      jwtService.signAsync = jest.fn().mockResolvedValue(mockToken);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true); // Simulate correct password comparison

      const result = await authController.signIn(signInDto);

      expect(result.access_token).toBe(mockToken);
      expect(userService.findOneByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      const signInDto = { email: 'test@example.com', password: 'password123' };

      userService.findOneByEmail = jest.fn().mockResolvedValue(null); // Simulating user not found

      await expect(authController.signIn(signInDto)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(userService.findOneByEmail).toHaveBeenCalledWith(signInDto.email);
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const signInDto = { email: 'test@example.com', password: 'password123' };

      const mockUser = {
        id: 'user-id',
        email: 'test@example.com',
        password: 'hashedpassword123',
      };

      userService.findOneByEmail = jest.fn().mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compareSync').mockReturnValue(false); // Simulate incorrect password comparison

      await expect(authController.signIn(signInDto)).rejects.toThrowError(
        UnauthorizedException,
      );
      expect(bcrypt.compareSync).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
    });
  });
});
