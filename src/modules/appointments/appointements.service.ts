import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AppointmentsRepository } from './appointments.repository';
import { Appointment } from './entities/appointment.entity';
import { CreateBookingDto, UpdateAppointementStatusDto } from './appointment.dto';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/services/user.service';
import { ScheduleService } from '../schedules/schedule.service';
import { TimeSlot } from '../schedules/entities/time-slots.entity';
import { AppointmentStatuses } from './appointment.enums';
import { formatDate } from '../common/helpers/date.helper';
import { PaginatedRecordsDto, QueryParamsDto } from '../common/dtos/pagination.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly userService: UserService,
    private readonly scheduleService: ScheduleService,
    private readonly appointmentRepo: AppointmentsRepository,
  ) {}

  async createBooking(customer: User, data: CreateBookingDto): Promise<any> {
    const { merchantId, date, time } = data;

    const availableSlots = await this.scheduleService.getMerchantAvailableTimeslots(
      merchantId,
      new Date(date),
      time,
    );

    if (availableSlots) {
      const [{ timeSlots }] = availableSlots.flat();

      const timeslot = timeSlots.find((slot: TimeSlot) => slot.startTime === time);

      if (!timeslot) {
        throw new NotFoundException(
          `Time slot not available. Other available time slots for ${formatDate(date)} are: ${timeSlots.map((slot) => slot.startTime).join(', ')}`,
        );
      } else {
        const _appointment = new Appointment();

        _appointment.timeslotId = timeslot.id;
        _appointment.customerId = customer.id;
        _appointment.merchantId = timeslot.merchantId;
        _appointment.status = AppointmentStatuses.BOOKED;
        _appointment.date = new Date(date);

        return this.appointmentRepo.create(_appointment, timeslot);
      }
    } else {
      throw new BadRequestException(`No schedule available on ${date}`);
    }
  }

  /**
   * Used to fetch all appointments
   * for either merchant or customer
   * @param userId
   * @param query
   */
  async getAllAppointments(
    userId: string,
    query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Appointment>> {
    return this.appointmentRepo.findAll(userId, query);
  }

  async manage(
    id: number,
    merchant: User,
    data: UpdateAppointementStatusDto,
  ): Promise<Appointment> {
    if (await this.appointmentOwnedByUser(id, merchant.id)) {
      const appointment: Appointment = await this.appointmentRepo.findOne(id);
      const { status: recordStatus } = appointment;
      const { status: newStatus } = data;

      if (recordStatus === newStatus) {
        throw new BadRequestException(`Appointment is already ${recordStatus}`);
      }

      if (
        recordStatus === AppointmentStatuses.BOOKED &&
        ![AppointmentStatuses.CONFIRMED, AppointmentStatuses.CANCELED].includes(newStatus)
      ) {
        throw new BadRequestException(
          `Invalid status transition from ${recordStatus} to ${newStatus}`,
        );
      }
      appointment.status = newStatus;
      return this.appointmentRepo.update(id, appointment);
    }

    throw new ForbiddenException('You do not own this appointment');
  }

  /**
   * finalize appointment after
   * business conditions have
   * been met.
   * Unfinalized appointments gets
   * released and timeslot are relased
   * after a certain period of time.
   * @param id
   * @param customer
   */
  async finalize(id: number, customer: User): Promise<Appointment> {
    if (await this.appointmentOwnedByUser(id, customer.id)) {
      const appointment: Appointment = await this.appointmentRepo.findOne(id);
      appointment.status = AppointmentStatuses.CONFIRMED;
      return this.appointmentRepo.update(id, appointment);
    }

    throw new ForbiddenException('Cannot access this resource');
  }

  /**
   * check if appointment record
   * belongs to user or agent
   * @param appointmentId
   * @param userId
   * @private
   */
  private async appointmentOwnedByUser(appointmentId: number, userId: string): Promise<Boolean> {
    const appointment = await this.appointmentRepo.findOne(appointmentId);
    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // works for both customer and merchant
    return appointment.customerId === userId || appointment.merchantId === userId;
  }
}
