import { Module } from '@nestjs/common';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { ScheduleDefinitionRepository } from './repositories/schedule-definition.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleDefinition } from './entities/schedule-definitions.entity';
import { Schedule } from './entities/schedule.entity';
import { ScheduleRepository } from './repositories/schedule.repository';
import { TimeSlot } from './entities/time-slots.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, ScheduleDefinition, TimeSlot])],
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository, ScheduleDefinitionRepository],
})
export class ScheduleModule {}
