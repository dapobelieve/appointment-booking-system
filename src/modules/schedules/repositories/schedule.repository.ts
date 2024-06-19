import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { TimeSlot } from '../entities/time-slots.entity';
import { ScheduleDefinition } from '../entities/schedule-definitions.entity';

@Injectable()
export class ScheduleRepository {
  constructor(
    @InjectRepository(Schedule)
    private readonly _schedule: Repository<Schedule>,

    private readonly dataSource: DataSource,

    @InjectRepository(TimeSlot)
    private readonly _timeslot: Repository<TimeSlot>,
  ) {}

  /**
   * create a new schedule
   * @param scheduleData
   */
  async create(scheduleData: Partial<Schedule>): Promise<Schedule> {
    const newSchedule = this._schedule.create({
      ...scheduleData,
    });
    return this._schedule.save(newSchedule);
  }

  async findOne(id: number): Promise<Schedule | null> {
    return this._schedule.findOne({ where: { id, deletedAt: null }, relations: ['timeslots'] });
  }

  async update(id: number, updateData: Partial<Schedule>): Promise<Schedule> {
    const schedule = await this.findOne(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    Object.assign(schedule, updateData);

    return this._schedule.save(schedule);
  }

  async saveScheduleTimeslots(entries: TimeSlot[]): Promise<void> {
    await this.dataSource.transaction(async (txnEntityMgr) => {
      await Promise.all(
        entries.map(async (entry) => {
          const timeslotRepo = txnEntityMgr.getRepository(TimeSlot);
          await timeslotRepo.save(entry);
        }),
      );
    });
  }

  /**
   * Checks for overlapping schedules
   * for a merchant
   * @param startDate
   * @param endDate
   * @param merchantId
   * @param excludeId
   */
  async isOverlapping(
    startDate: Date,
    endDate: Date,
    merchantId: string,
    excludeId?: number,
  ): Promise<any> {
    const query = this._schedule
      .createQueryBuilder('schedule')
      .where('(schedule.startDate, schedule.endDate) OVERLAPS (:startDate, :endDate)', {
        startDate,
        endDate,
      })
      .andWhere('schedule.merchantId = :merchantId', { merchantId })
      .andWhere('schedule.deletedAt is null');

    // if (excludeId) {
    //   query.andWhere('schedule.id != :excludeId', { excludeId });
    // }

    const count = await query.getCount();
    return count > 0;
  }
}
