import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDefinitionRepository } from './repositories/schedule-definition.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleDefinition } from './entities/schedule-definitions.entity';
import { Schedule } from './entities/schedule.entity';
import { ScheduleRepository } from './repositories/schedule.repository';
import { TimeSlot } from './entities/time-slots.entity';
import { UserModule } from '../users/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, ScheduleDefinition, TimeSlot]), UserModule],
  providers: [ScheduleService, ScheduleRepository, ScheduleDefinitionRepository],
  exports: [ScheduleService],
})
export class ScheduleModule {}
