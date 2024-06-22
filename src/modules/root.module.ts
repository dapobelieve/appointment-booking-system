import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { IamModule } from './iam/iam.module';
import appConfig from './config/app.config';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppInterceptor } from './common/interceptors/app.interceptor';
import { UserModule } from './users/user.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from './schedules/schedule.module';
import { CustomerModule } from './customers/customer.module';
import { MerchantModule } from './merchants/merchant.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return configService.get('database');
      },
      inject: [ConfigService],
    }),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.json(),
        }),
      ],
    }),
    EventEmitterModule.forRoot(),
    CommonModule,
    IamModule,
    UserModule,
    ScheduleModule,
    MerchantModule,
    CustomerModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AppInterceptor,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    },
  ],
  exports: [],
})
export class AppModule {}
