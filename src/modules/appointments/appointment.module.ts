import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentsService } from './appointements.service';
import { AppointmentsRepository } from './appointments.repository';
import { Appointment } from './entities/appointment.entity';
import { UserModule } from '../users/user.module';
import { ScheduleModule } from '../schedules/schedule.module';

@Module({
  imports: [UserModule, ScheduleModule, TypeOrmModule.forFeature([Appointment])],
  providers: [AppointmentsService, AppointmentsRepository],
  exports: [AppointmentsService],
})
export class AppointmentModule {}
