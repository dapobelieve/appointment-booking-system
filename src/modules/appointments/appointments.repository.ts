import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { TimeSlot } from '../schedules/entities/time-slots.entity';
import { ScheduleTimeSlotStatus } from '../schedules/schedule.enums';
import { AppointmentStatuses } from './appointment.enums';
import { PageInfo, PaginatedRecordsDto, QueryParamsDto } from '../common/dtos/pagination.dto';

@Injectable()
export class AppointmentsRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Appointment)
    private readonly _appointment: Repository<Appointment>,
  ) {}

  async create(appointmentData: Partial<Appointment>, timeSlot: TimeSlot): Promise<Appointment> {
    return await this.dataSource.transaction(async (txnEntityMgr) => {
      timeSlot.status = ScheduleTimeSlotStatus.BOOKED;
      await txnEntityMgr.getRepository(TimeSlot).save(timeSlot);

      const newAppointment = this._appointment.create(appointmentData);
      return await txnEntityMgr.getRepository(Appointment).save(newAppointment);
    });
  }

  async findOne(id: number): Promise<Appointment | null> {
    return this._appointment.findOne({ where: { id } });
  }

  async findAll(userId: string, query: QueryParamsDto): Promise<PaginatedRecordsDto<Appointment>> {
    const { status, startsAt, endsAt, sortOrder, sortBy, limit, page } = query;
    const _query = this._appointment.createQueryBuilder('apps');

    if (status) {
      _query.andWhere('apps.status = ANY(:statuses)', {
        statuses: status.toUpperCase().split(', '),
      });
    }

    _query.andWhere('apps.merchantId = :userId OR apps.customerId = :userId', { userId });

    if (startsAt && endsAt) {
      _query.andWhere(`apps.createdAt BETWEEN :startsAt AND :endsAt`, {
        startsAt,
        endsAt,
      });
    }

    const totalCountQuery = _query.clone();

    _query
      .orderBy(`apps.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [total, data] = await Promise.all([totalCountQuery.getCount(), _query.getMany()]);

    const pageInfo: PageInfo = {
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };

    return { data, pageInfo };
  }

  async update(id: number, updateData: Partial<Appointment>): Promise<Appointment | null> {
    return await this.dataSource.transaction(async (txnEntityMgr) => {
      const appointmentToUpdate = await txnEntityMgr.getRepository(Appointment).findOneBy({ id });
      if (!appointmentToUpdate) {
        return null;
      }

      const { status } = updateData;
      const timeSlot = await txnEntityMgr
        .getRepository(TimeSlot)
        .findOneBy({ id: +appointmentToUpdate.timeslotId });

      if (status && status == AppointmentStatuses.CANCELED) {
        timeSlot.status = ScheduleTimeSlotStatus.AVAILABLE;
        await txnEntityMgr.getRepository(TimeSlot).save(timeSlot);
      } else if (status && status == AppointmentStatuses.COMPLETED) {
        timeSlot.status = ScheduleTimeSlotStatus.BOOKED;
      }

      return await txnEntityMgr
        .getRepository(Appointment)
        .save({ ...appointmentToUpdate, ...updateData });
    });
  }
}
