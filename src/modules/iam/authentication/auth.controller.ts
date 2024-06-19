import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import {
  SignupDto,
  SignIn,
  // CourierSignupDto,
  VerifyOtpDto,
  ResendOTPDto,
  CreateAdminDto,
  ResetPassword,
  UpdatePassword,
} from './dtos/auth.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enums';
import { RefreshTokenDto } from './dtos/refresh-token.dto';

@Auth(AuthType.None)
@Controller('v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/auth/sign-up')
  async adminSignUp(@Body() data: CreateAdminDto) {
    return this.authService.createAdmin(data);
  }

  @Post('auth/sign-up')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/sign-in')
  async signIn(@Res({ passthrough: true }) response: Response, @Body() signInDto: SignIn) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/refresh-tokens')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  // @Post('auth/resend-otp')
  // async resend(@Body() data: ResendOTPDto) {
  //   return this.authService.resendOTP(data);
  // }

  // @Post('auth/verify-otp')
  // async verifyOTP(@Body() data: VerifyOtpDto) {
  //   return this.authService.verifyOtp(data);
  // }

  @HttpCode(HttpStatus.OK)
  @Post('auth/reset-password')
  async resetPassword(@Body() data: ResetPassword) {
    return this.authService.resetPassword(data);
  }

  // @Post('auth/update-password')
  // async updatePassword(@Body() data: UpdatePassword) {
  //   return this.authService.updatePassword(data);
  // }
}
