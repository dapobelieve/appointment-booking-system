import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { AppointmentModule } from '../appointments/appointment.module';
import { UserModule } from '../users/user.module';
import { ScheduleModule } from '../schedules/schedule.module';

@Module({
  imports: [AppointmentModule, UserModule, ScheduleModule],
  controllers: [CustomerController],
})
export class CustomerModule {}
