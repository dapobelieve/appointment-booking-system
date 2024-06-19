import { IsString } from 'class-validator';

export class CreateSettingDto {
  @IsString()
  name: string;

  @IsString()
  value: string;
}
