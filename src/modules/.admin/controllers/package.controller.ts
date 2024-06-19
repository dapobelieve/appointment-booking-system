import { Controller, Get, Query } from '@nestjs/common';
import { PaginatedRecordsDto, QueryParamsDto } from '../../common/dtos/pagination.dto';
import { PackageService } from '../../packages/package.service';
import { Package } from '../../packages/entites/package.entity';

@Controller('v1/admin')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Get('packages/:id')
  async getPackageDetails(@Query() query: QueryParamsDto): Promise<PaginatedRecordsDto<Package>> {
    return this.packageService.getAdminPackages(query);
  }

  @Get('packages')
  async getPackages(@Query() query: QueryParamsDto): Promise<PaginatedRecordsDto<Package>> {
    return this.packageService.getAdminPackages(query);
  }
}
