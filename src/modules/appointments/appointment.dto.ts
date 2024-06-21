import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsUUID, Matches } from 'class-validator';
import { Transform } from 'class-transformer';
import { format, parse } from 'date-fns';
import { AppointmentStatuses } from './appointment.enums';

export class CreateBookingDto {
  @IsUUID()
  @IsNotEmpty()
  merchantId: string;

  @IsDate()
  date: Date;

  @IsNotEmpty({ message: 'Enter a preffered time' })
  @Matches('^(?:[01][0-9]|2[0-3]):(?:[0-5][0-9])$')
  @Transform(({ value }) => format(parse(value, 'HH:mm', new Date()), 'HH:mm'))
  time: string;
}

export class UpdateAppointementStatusDto {
  @IsEnum(AppointmentStatuses)
  status: AppointmentStatuses;
}
