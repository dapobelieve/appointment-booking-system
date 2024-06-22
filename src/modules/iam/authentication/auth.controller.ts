import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { SignupDto, SignIn, CreateAdminDto, ResetPassword } from './dtos/auth.dto';
import { Response } from 'express';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enums';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { ApiTags } from '@nestjs/swagger';
import { SwaggerApiTagsEnum } from '../../common/enums/role.enum';
import { ApiOkResponse } from '@nestjs/swagger/dist/decorators/api-response.decorator';
import { User } from '../../users/entities/user.entity';

@Auth(AuthType.None)
@ApiTags(SwaggerApiTagsEnum.AUTHENTICATION)
@Controller('v1')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    type: User,
  })
  @Post('auth/sign-up')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signUp(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/sign-in')
  async signIn(@Body() signInDto: SignIn) {
    return await this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('auth/refresh-tokens')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
