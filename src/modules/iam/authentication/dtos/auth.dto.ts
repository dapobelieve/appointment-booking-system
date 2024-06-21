import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommonFields {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class SignIn {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  // @IsEnum(['sender', 'courier', 'admin'], {
  //   message: 'Platform must be one of sender, courier, admin',
  // })
  // platform: string;
}

export class SignupDto extends CommonFields {
  @ApiProperty()
  @IsString()
  name: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fcmToken: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsUrl()
  @IsOptional()
  profilePhoto: string;

  @IsOptional()
  @IsString()
  idNumber: string;

  @IsUrl()
  @IsOptional()
  idImageFront: string;

  @IsUrl()
  @IsOptional()
  idImageBack: string;

  @IsUrl()
  @IsOptional()
  electricityBill: string;

  @IsBoolean()
  @IsOptional()
  isActivated: boolean;
}

export class VerifyOtpDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsNumber()
  otp: number;
}

export class ResendOTPDto {
  @IsString()
  @IsEmail()
  email: string;
}

export class ResetPassword {
  @IsString()
  @IsEmail()
  email: string;
}

export class UpdatePassword {
  @IsString()
  otp: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}

export class CreateAdminDto extends CommonFields {}
