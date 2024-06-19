import { IsEnum, IsString, ValidateIf } from 'class-validator';

export class ApproveTxnDto {
  @IsEnum(['approve', 'reject'])
  readonly status: string;

  @ValidateIf((o) => o.status === 'reject')
  @IsString()
  readonly reason: string;
}
