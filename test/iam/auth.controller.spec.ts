import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/iam/authentication/auth.controller';
import { AuthService } from '../../src/modules/iam/authentication/auth.service';
import { User } from '../../src/modules/users/entities/user.entity';
import { SignIn, SignupDto } from '../../src/modules/iam/authentication/dtos/auth.dto';
import { HashingService } from '../../src/modules/iam/authentication/services/hashing.service';
import { BcryptService } from '../../src/modules/iam/authentication/services/bcrypt.service';
import { UserRole, UserStatus } from '../../src/modules/common/enums/role.enum';
import { v4 } from 'uuid';
import { UserRepository } from '../../src/modules/users/repositories/user.repository';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

describe('Authentication Controller', () => {
  let authController: AuthController;
  let authService: AuthService;
  let userRepository: UserRepository;

  const testCustomer1: User = {
    name: 'John Aula',
    email: 'aula@gmail.com',
    role: UserRole.CUSTOMER,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    id: v4(),
    password: '',
    ip: '0.0.0.0',
  };

  const testMerchant1: User = {
    id: v4(),
    name: 'Tester1',
    email: 'tester-email@gmail.com',
    role: UserRole.MERCHANT,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: '',
    ip: '0.0.0.0',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signUp: jest.fn(),
            signIn: jest.fn(),
            refreshToken: jest.fn(),
            resetPassword: jest.fn(),
          },
        },
        {
          provide: HashingService,
          useClass: BcryptService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signup', () => {
    it('should call authService.signUp with correct parameters', async () => {
      const signupDto: SignupDto = {
        name: 'Tester1',
        email: 'tester-email@gmail.com',
        password: 'password123',
      };
      await authController.signup(signupDto);
      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
    });

    it('should create a CUSTOMER account', async () => {
      const signupDto: SignupDto = {
        name: 'John Aula',
        email: 'aula@gmail.com',
        password: 'password123',
      };

      jest.spyOn(authService, 'signUp').mockResolvedValue(testCustomer1);
      const result = await authController.signup(signupDto);

      expect(authService.signUp).toHaveBeenCalledWith(signupDto);
      expect(result).toEqual(testCustomer1);
    });

    it('should prevent already existing email', async () => {
      const signupDto: SignupDto = {
        name: 'John Aula',
        email: 'aula@gmail.com',
        password: 'password123',
      };

      jest
        .spyOn(authService, 'signUp')
        .mockRejectedValue(new ConflictException('Email already in use'));

      await expect(authController.signup(signupDto)).rejects.toThrow(ConflictException);
    });

    it('should create a user with role CUSTOMER', async () => {
      const signupDto: SignupDto = {
        name: 'John Aula',
        email: 'aula@gmail.com',
        password: 'password123',
      };

      const newUser = { ...testCustomer1 };

      jest.spyOn(authService, 'signUp').mockResolvedValue({ ...newUser });

      const result = await authController.signup(signupDto);

      expect(result).toEqual(newUser);
    });

    it('should create a user with role MERCHANT if type property is passed on sign up', async () => {
      const signupDto: SignupDto = {
        name: 'John Aula',
        email: 'aula@gmail.com',
        password: 'password123',
        type: 'merchant',
      };

      const newUser = { ...testCustomer1, role: UserRole.MERCHANT };

      jest.spyOn(authService, 'signUp').mockResolvedValue({ ...newUser });

      const result = await authController.signup(signupDto);

      expect(result).toEqual(newUser);
      expect(result.role).toEqual(UserRole.MERCHANT);
    });
  });

  describe('signIn', () => {
    it('should call authService.signIn with correct parameters', async () => {
      const signInDto: SignIn = {
        email: 'testing@gmail.com',
        password: 'password123',
      };
      const response: any = {
        data: {
          accessToken: 'lorem10',
          refreshToken: '',
        },
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(response);

      await authController.signIn(signInDto);

      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });

    it('should throw error if user does not exist', async () => {
      const signInDto: SignIn = {
        email: 'testing@gmail.com',
        password: 'password123',
      };

      const authServiceMock = jest.spyOn(authService, 'signIn');
      authServiceMock.mockRejectedValue(new UnauthorizedException('User does not exist'));

      await expect(authController.signIn(signInDto)).rejects.toThrow(UnauthorizedException);

      expect(authServiceMock).toHaveBeenCalledTimes(1);
      expect(authServiceMock).toHaveBeenCalledWith(signInDto);
    });

    it('returns access and refresh tokens when signed in', async () => {
      const signInDto: SignIn = {
        email: 'testing@gmail.com',
        password: 'password123',
      };

      const authServiceMock = jest.spyOn(authService, 'signIn');
      authServiceMock.mockResolvedValue({
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        refreshToken:
          'TA2MDIxNiwiZXhwIjoxNzE5MTQ1NjE2fQ.VpisNSTCo6vX7FGRPPxj2lE-xVNwzBv3RhXaNMUNCes',
      });

      const response = await authController.signIn(signInDto);

      expect(response).toEqual({
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        refreshToken:
          'TA2MDIxNiwiZXhwIjoxNzE5MTQ1NjE2fQ.VpisNSTCo6vX7FGRPPxj2lE-xVNwzBv3RhXaNMUNCes',
      });
    });
  });
});
