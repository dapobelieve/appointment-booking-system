import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { UserService } from '../../users/services/user.service';
import { QueryParamsDto } from '../../common/dtos/pagination.dto';
import { UserRole } from '../../common/enums/role.enum';
import { UpdateUserDto } from '../../iam/authentication/dtos/auth.dto';
import { ActivateCourierDto } from '../dtos/courier.dto';
import { Roles } from '../../iam/authorization/decorators/role.decorator';
import { RedisService } from '../../redis/redis.service';

@Roles(UserRole.ADMIN)
@Controller('v1/admin')
export class CourierController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @Get('couriers/:id')
  async getCourierDetails(@Param('id') courierId: string) {
    return this.userService.me(courierId);
  }

  @Patch('couriers/:id')
  async activateCourier(@Param('id') courierId: string, @Body() data: ActivateCourierDto) {
    return this.userService.update(courierId, UserRole.ADMIN, {
      isActivated: data.activate,
    } as UpdateUserDto);
  }

  @Get('users')
  async getUsers(@Query() query: QueryParamsDto) {
    return this.userService.getAdminUsers(query);
  }

  @Get('online-couriers')
  async getOnlineCouriers(@Query() query: QueryParamsDto) {
    return this.redisService.getOnlineCouriers();
  }
}
