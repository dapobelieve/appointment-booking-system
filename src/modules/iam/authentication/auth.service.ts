import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { HashingService } from './services/hashing.service';
import { UserRepository } from '../../users/repositories/user.repository';
import {
  // CourierSignupDto,
  CreateAdminDto,
  ResetPassword,
  SignIn,
  SignupDto,
  UpdatePassword,
  VerifyOtpDto,
} from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { randomUUID } from 'crypto';
import { InvalidateRefreshTokenError, RefreshTokenIdsStorage } from './refresh-token-ids.storage';
import { User } from '../../users/entities/user.entity';
import { UserRole } from '../../common/enums/role.enum';
import { differenceInMinutes } from 'date-fns';

const crypto = require('crypto');

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
  ) {}

  async createAdmin(data: CreateAdminDto): Promise<User> {
    const { email, password } = data;
    const [emailExists] = await Promise.all([
      await this.userRepository.findOneBy({ email: email }),
    ]);

    if (emailExists) {
      throw new ConflictException('User with email/phone already exists');
    }

    const _newUser: Partial<User> = {
      ...data,
      password: await this.hashingService.hash(data.password),
      role: UserRole.ADMIN,
    };

    return this.userRepository.create(_newUser);
  }

  async signUp(signUpDto: SignupDto) {
    const { email, password } = signUpDto;
    const [emailExists] = await Promise.all([this.userRepository.findOneBy({ email: email })]);

    if (emailExists) {
      throw new ConflictException('User with email already exists');
    }

    const hashedPassword = await this.hashingService.hash(signUpDto.password);

    const _newUser: Partial<User> = {
      ...signUpDto,
      ip: '0.0.0.0',
      password: hashedPassword,
      role: 'type' in signUpDto ? UserRole.MERCHANT : UserRole.CUSTOMER,
    };

    return await this.userRepository.create(_newUser);
  }

  private generateOtp() {
    return crypto.randomInt(1000, 9999).toString();
  }

  async signIn(signinDto: SignIn) {
    const user: User = await this.userRepository.findOneBy(
      {
        email: signinDto.email,
      },
      ['id', 'email', 'role', 'password'],
    );

    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }

    const isPasswordMatch = await this.hashingService.compare(signinDto.password, user.password);

    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid Password');
    }

    // if (user.role !== signinDto.platform) {
    //   throw new BadRequestException(`Roles don't match, check if you have the right app`);
    // }

    // if (user.role === UserRole.COURIER) {
    //   console.log('emitting event');
    //   await this.txnService.createWallet({ id: user.id });
    // }
    //
    // if (user.role === UserRole.COURIER && !user.otpVerified) {
    //   throw new BadRequestException('User account not verified');
    // }

    return await this.generateTokens(user);
  }

  public async generateTokens(user: User) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signToken(user.id, this.jwtConfiguration.accessTokenTtl, {
        id: user.id,
        email: user.email,
        role: user.role,
      }),
      this.signToken(user.id, this.jwtConfiguration.refreshTokenTtl, {
        refreshTokenId,
      }),
    ]);

    // await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);
    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<any, 'sub'> & { refreshTokenId: string }
      >(refreshTokenDto.refreshToken, {
        secret: this.jwtConfiguration.secret,
      });

      const user = await this.userRepository.findOneBy({
        id: sub,
      });

      // const isValid = await this.refreshTokenIdsStorage.validate(
      //   user.id,
      //   refreshTokenId,
      // );

      // if (isValid) {
      //   await this.refreshTokenIdsStorage.invalidate(user.id);
      // } else {
      //   throw new Error('Refresh token is invalid');
      // }

      return this.generateTokens(user);
    } catch (err) {
      if (err instanceof InvalidateRefreshTokenError) {
        throw new UnauthorizedException('Access Denied');
      }
      throw new UnauthorizedException(err);
    }
  }

  private async signToken<T>(userId: string, expiresIn: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        expiresIn,
      },
    );
  }

  async resetPassword(data: ResetPassword) {
    const { email } = data;
    const user = await this.userRepository.findOneBy({ email });

    // if (user) {
    //   await this.sendOTP(user, 'otp', 'Use the OTP to reset your password', 'Reset Password OTP');
    // }

    return { message: 'password reset mail sent' };
  }

  // async updatePassword(data: UpdatePassword) {
  //   const { otp: inputOtp, password } = data;
  //
  //   const user = await this.userRepository.findOneBy({ otp: inputOtp });
  //
  //   const { otpExpiry, id } = user;
  //   if (!user) {
  //     throw new BadRequestException('Invalid OTP');
  //   }
  //
  //   if (differenceInMinutes(new Date(), new Date(otpExpiry)) < 0) {
  //     await this.userRepository.update(id, {
  //       otp: null,
  //       otpExpiry: null,
  //       password: await this.hashingService.hash(data.password),
  //     });
  //
  //     return {
  //       message: 'Password reset successfully',
  //     };
  //   } else {
  //     throw new BadRequestException('OTP Expired');
  //   }
  // }
}
