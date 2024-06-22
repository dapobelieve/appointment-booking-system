import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../../src/modules/iam/authentication/auth.controller';
import { AuthService } from '../../src/modules/iam/authentication/auth.service';
import {
  SignupDto,
  SignIn,
  CreateAdminDto,
  ResetPassword,
} from '../../src/modules/iam/authentication/dtos/auth.dto';
import { RefreshTokenDto } from '../../src/modules/iam/authentication/dtos/refresh-token.dto';
import { HashingService } from '../../src/modules/iam/authentication/services/hashing.service';
import { BcryptService } from '../../src/modules/iam/authentication/services/bcrypt.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

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
  });

  describe('signIn', () => {
    it('should call authService.signIn with correct parameters', async () => {
      const signInDto: SignIn = {
        email: 'testing@gmail.com',
        password: 'password123',
      };
      const response: any = {
        /* mock response object if needed */
      };
      await authController.signIn(response, signInDto);
      expect(authService.signIn).toHaveBeenCalledWith(signInDto);
    });
  });

  // describe('refreshToken', () => {
  //   it('should call authService.refreshToken with correct parameters', async () => {
  //     const refreshTokenDto: RefreshTokenDto = {
  //       /* fill in required fields */
  //     };
  //     await authController.refreshToken(refreshTokenDto);
  //     expect(authService.refreshToken).toHaveBeenCalledWith(refreshTokenDto);
  //   });
  // });

  // describe('resetPassword', () => {
  //   it('should call authService.resetPassword with correct parameters', async () => {
  //     const resetPasswordDto: ResetPassword = {
  //       /* fill in required fields */
  //     };
  //     await authController.resetPassword(resetPasswordDto);
  //     expect(authService.resetPassword).toHaveBeenCalledWith(resetPasswordDto);
  //   });
  // });
});
