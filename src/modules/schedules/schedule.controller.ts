import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateScheduleDefinitionDTO, CreateScheduleDto } from './schedule.dto';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enums';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { UserRole } from '../common/enums/role.enum';
import { ScheduleService } from './schedule.service';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { User } from '../users/entities/user.entity';
import { ScheduleDefinition } from './entities/schedule-definitions.entity';

@Auth(AuthType.Bearer)
@Roles(UserRole.MERCHANT)
@Controller('v1/schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('')
  async createSchedule(
    @ActiveUser() merchant: User,
    @Body() data: CreateScheduleDto,
  ): Promise<any> {
    return await this.scheduleService.createSchedule(merchant, data);
  }

  @Get('schedule-templates')
  async getAllSchdeuleDefinitions(
    @ActiveUser() merchant: User,
  ): Promise<ScheduleDefinition[] | null> {
    return this.scheduleService.getAllScheduleDefinitions(merchant);
  }

  @Post('schedule-templates')
  async createScheduleDefinition(
    @ActiveUser() merchant: User,
    @Body() data: CreateScheduleDefinitionDTO,
  ): Promise<any> {
    return this.scheduleService.createSchdeuleDefinition(merchant, data);
  }
}
