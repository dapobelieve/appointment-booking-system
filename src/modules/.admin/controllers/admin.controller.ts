import { Controller, Get, Query } from '@nestjs/common';
import { AdminService } from '../admin.service';
import { QueryParamsDto } from '../../common/dtos/pagination.dto';
import { UserRole } from '../../common/enums/role.enum';
import { Roles } from '../../iam/authorization/decorators/role.decorator';

@Roles(UserRole.ADMIN)
@Controller('v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getStats() {
    return this.adminService.getStats();
  }

  @Get('dashboard/recent-deliveries')
  async getRecentDeliveries(@Query() query: QueryParamsDto) {
    return this.adminService.getRecentDeliveries(query);
  }
}
