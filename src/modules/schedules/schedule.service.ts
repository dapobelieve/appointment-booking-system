import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDefinitionDTO, CreateScheduleDto } from './schedule.dto';
import { ScheduleDefinition } from './entities/schedule-definitions.entity';
import { ScheduleDefinitionRepository } from './repositories/schedule-definition.repository';
import { User } from '../users/entities/user.entity';
import { Schedule } from './entities/schedule.entity';
import { formatDate } from '../common/helpers/date.helper';
import { addDays, isBefore } from 'date-fns';
import { ScheduleRepository } from './repositories/schedule.repository';
import { TimeSlot } from './entities/time-slots.entity';
import { ScheduleTimeSlotStatus } from './schedule.enums';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly scheduleRepo: ScheduleRepository,
    private readonly scheduleDefinitionRepo: ScheduleDefinitionRepository,
  ) {}

  async createSchedule(merchant: User, data: CreateScheduleDto): Promise<Schedule> {
    const { startDate, endDate, templateId } = data;
    const todaysDate = formatDate();

    if (isBefore(formatDate(startDate), todaysDate)) {
      throw new Error('Schedule cannot start from the past');
    }

    if (isBefore(formatDate(endDate), formatDate(startDate))) {
      throw new Error(`End of schedule cannot be lesser than ${formatDate(startDate)}`);
    }

    let newSchedule: Schedule;

    const scheduleTemplate = await this.getMerchantScheduleDefinition(data.templateId, merchant.id);

    if (!(await this.scheduleRepo.isOverlapping(startDate, endDate, merchant.id))) {
      newSchedule = await this.scheduleRepo.create({
        merchantId: merchant.id,
        scheduleDefinition: scheduleTemplate,
        startDate: new Date(formatDate(startDate)),
        endDate: new Date(formatDate(endDate)),
      });

      const timeSlots = await this.generateScheduleTimeSlotsBasedOnScheduleTemplate(
        newSchedule,
        scheduleTemplate,
      );

      await this.scheduleRepo.saveScheduleTimeslots(timeSlots);

      // return this.scheduleRepo.update(newSchedule.id, newSchedule);

      return this.scheduleRepo.findOne(newSchedule.id);
    } else {
      throw new BadRequestException('Date range overlaps with existing schedule');
    }
  }

  private async generateScheduleTimeSlotsBasedOnScheduleTemplate(
    schedule: Schedule,
    template: ScheduleDefinition,
  ): Promise<TimeSlot[]> {
    const { startDate, endDate } = schedule;

    const entries = [];
    let currentDate = startDate;

    while (isBefore(currentDate, addDays(endDate, 1))) {
      const day = formatDate(currentDate);
      for (const timeSlot of template.timeSlots) {
        const entry = new TimeSlot();
        entry.date = new Date(day);
        entry.startTime = timeSlot.startTime;
        entry.endTime = timeSlot.endTime;
        entry.schedule = schedule;
        entry.status = ScheduleTimeSlotStatus.AVAILABLE;
        entries.push(entry);
      }
      currentDate = addDays(currentDate, 1);
    }

    return entries;
  }

  async createSchdeuleDefinition(
    merchant: User,
    data: CreateScheduleDefinitionDTO,
  ): Promise<ScheduleDefinition | any> {
    const _data = new ScheduleDefinition();
    _data.merchantId = merchant.id;
    _data.merchant = merchant;
    _data.timeSlots = data.timeslots;

    return this.scheduleDefinitionRepo.create(_data);
  }

  async getAllScheduleDefinitions(merchant: User): Promise<ScheduleDefinition[]> {
    return this.scheduleDefinitionRepo.findAllByMerchantId(merchant.id);
  }

  private async getMerchantScheduleDefinition(id: number, merchantId: string) {
    const scheduleDefinition = await this.scheduleDefinitionRepo.findOne(id);

    if (!scheduleDefinition) {
      throw new NotFoundException('Schedule Template not found');
    }

    if (scheduleDefinition.merchantId !== merchantId) {
      throw new NotFoundException('Schedule Template not found for this merchant');
    }

    return scheduleDefinition;
  }
}
