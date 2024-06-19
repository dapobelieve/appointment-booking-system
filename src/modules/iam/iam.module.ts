import { Module } from '@nestjs/common';
import { BcryptService } from './authentication/services/bcrypt.service';
import { HashingService } from './authentication/services/hashing.service';
import { UserRepository } from '../users/repositories/user.repository';
import { AuthController } from './authentication/auth.controller';
import { AuthService } from './authentication/auth.service';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from './config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { AccessTokenGuard } from './authentication/guards/access-token.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './authentication/guards/authentication.guard';
import { RoleGuard } from './authorization/guards/role.guard';
import { RefreshTokenIdsStorage } from './authentication/refresh-token-ids.storage';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    TypeOrmModule.forFeature([User]),
    UserModule,
  ],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    {
      // all endpoints become protected with this global guard
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
    AccessTokenGuard,
    AuthService,
    RefreshTokenIdsStorage,
    UserRepository,
  ],
  controllers: [AuthController],
})
export class IamModule {}
