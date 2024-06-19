import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { parse, isAfter, compareAsc, parseISO, isBefore } from 'date-fns';

export function IsStartBeforeEnd(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isStartBeforeEnd',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          if (!relatedValue) return false;

          const startTime = parse(relatedValue, 'HH:mm', new Date());
          const endTime = parse(value, 'HH:mm', new Date());
          return !isAfter(startTime, endTime);
        },
      },
    });
  };
}

@ValidatorConstraint({ name: 'validateTimeslots' })
export class ValidateTimeslotsConstraint implements ValidatorConstraintInterface {
  validate(timeslots: any[]) {
    for (let i = 0; i < timeslots.length - 1; i++) {
      const currentEndTime = parse(timeslots[i].endTime, 'HH:mm', new Date());
      const nextStartTime = parse(timeslots[i + 1].startTime, 'HH:mm', new Date());

      if (compareAsc(currentEndTime, nextStartTime) > 0) {
        return false;
      }
    }

    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'End time must be greater than start time. Check timslots array and correct the value';
  }
}

@ValidatorConstraint({ name: 'validDateRange' })
export class ValidateDateRangeConstraint implements ValidatorConstraintInterface {
  public message: string;
  validate(value: string, validationArguments?: ValidationArguments) {
    const { object } = validationArguments;
    const startDate = object['startDate'];
    const endDate = object['endDate'];
    const startDateObject = parseISO(startDate);
    const endDateObject = parseISO(endDate);
    const currentDate = new Date();

    console.log(endDateObject, endDateObject);

    if (isBefore(startDateObject, currentDate)) {
      this.message = 'Start date cannot be in the past';
      return false;
    }

    if (!isAfter(endDateObject, startDateObject)) {
      this.message = 'End date must be after start date';
      return false;
    }

    return true;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return this.message;
  }
}
