import { IsBoolean } from 'class-validator';

export class ActivateCourierDto {
  @IsBoolean()
  readonly activate: boolean;
}
