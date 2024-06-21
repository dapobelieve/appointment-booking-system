import { IsDateString, IsEnum, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class QueryParamsDto {
  @IsOptional()
  @IsIn(['CUSTOMER', 'MERCHANT', 'ADMIN'])
  role: string;

  @IsDateString()
  @IsOptional()
  startsAt?: Date;

  @IsDateString()
  @IsOptional()
  endsAt?: Date;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit = 25;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page = 1;

  @IsString()
  @IsOptional()
  status: string;

  @IsString()
  @IsOptional()
  type: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;
}

export type PageInfo = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export class PaginatedRecordsDto<T> {
  data: Array<T>;
  pageInfo: PageInfo;
}
