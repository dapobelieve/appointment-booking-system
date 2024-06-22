import {
  IsArray,
  IsDate,
  IsDateString,
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
  Validate,
  ValidateNested,
} from 'class-validator';
import { ScheduleDefinitionEnums, DaysOfWeek } from './schedule.enums';
import {
  IsStartBeforeEnd,
  ValidateDateRangeConstraint,
  ValidateTimeslotsConstraint,
} from './decorators/start-end-date.decorator';
import { format, parse } from 'date-fns';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class TimeSlotDTO {
  @IsNotEmpty({ message: 'startTime is required' })
  @Matches('^(?:[01][0-9]|2[0-3]):(?:[0-5][0-9])$')
  @Transform(({ value }) => format(parse(value, 'HH:mm', new Date()), 'HH:mm'))
  startTime: string;

  @IsNotEmpty({ message: 'endTime is required' })
  @Matches('^(?:[01][0-9]|2[0-3]):(?:[0-5][0-9])$')
  @Transform(({ value }) => format(parse(value, 'HH:mm', new Date()), 'HH:mm'))
  @IsStartBeforeEnd('startTime', {
    message: 'endTime must be after startTime',
  })
  endTime: string;
}

export class CreateScheduleDefinitionDTO {
  @ApiProperty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDTO)
  @Validate(ValidateTimeslotsConstraint)
  timeslots: {
    startTime: string;
    endTime: string;
  }[];
}

export class CreateScheduleDto {
  @ApiProperty()
  @IsDate()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  templateId: number;
}
