import { Module } from '@nestjs/common';
import { AppointmentModule } from '../appointments/appointment.module';
import { UserModule } from '../users/user.module';
import { ScheduleModule } from '../schedules/schedule.module';
import { MerchantController } from './merchant.controller';

@Module({
  imports: [AppointmentModule, UserModule, ScheduleModule],
  controllers: [MerchantController],
})
export class MerchantModule {}
