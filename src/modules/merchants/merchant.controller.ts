import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserService } from '../users/services/user.service';
import { AppointmentsService } from '../appointments/appointements.service';
import { ScheduleService } from '../schedules/schedule.service';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateScheduleDefinitionDTO, CreateScheduleDto } from '../schedules/schedule.dto';
import { ScheduleDefinition } from '../schedules/entities/schedule-definitions.entity';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enums';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { SwaggerApiTagsEnum, UserRole } from '../common/enums/role.enum';
import { PaginatedRecordsDto, QueryParamsDto } from '../common/dtos/pagination.dto';
import { Appointment } from '../appointments/entities/appointment.entity';
import { UpdateAppointementStatusDto } from '../appointments/appointment.dto';
import { ApiTags } from '@nestjs/swagger';

/**
 * Merchant Controller
 *
 * This controller handles requests related to merchants
 */
@Auth(AuthType.Bearer)
@Roles(UserRole.MERCHANT)
@ApiTags(SwaggerApiTagsEnum.MERCHANTS)
@Controller('v1/merchants')
export class MerchantController {
  constructor(
    private readonly userService: UserService,
    private readonly appointmentService: AppointmentsService,
    private readonly scheduleService: ScheduleService,
  ) {}

  /**
   * Create Schedule
   *
   * Creates a new schedule for the merchant
   *
   * @param merchant The active merchant
   * @param data The schedule data
   */
  @Post('schedule')
  async createSchedule(
    @ActiveUser() merchant: User,
    @Body() data: CreateScheduleDto,
  ): Promise<any> {
    return await this.scheduleService.createSchedule(merchant, data);
  }

  /**
   * Get All Schedule Templates
   *
   * Retrieves all schedule definitions for the merchant
   *
   * @param merchant The active merchant
   * @Body
   */
  @Get('schedule-templates')
  async getAllSchdeuleDefinitions(
    @ActiveUser() merchant: User,
  ): Promise<ScheduleDefinition[] | null> {
    return this.scheduleService.getAllScheduleDefinitions(merchant);
  }

  /**
   * Create Schedule Template
   *
   * Creates a new schedule definition for the merchant
   *
   * @param merchant The active merchant
   * @param data The schedule definition data
   */
  @Post('schedule-templates')
  async createScheduleDefinition(
    @ActiveUser() merchant: User,
    @Body() data: CreateScheduleDefinitionDTO,
  ): Promise<any> {
    return this.scheduleService.createSchdeuleDefinition(merchant, data);
  }

  /**
   * Get All Appointments
   *
   * Retrieves all appointments for the merchant
   *
   * @param merchant The active merchant
   * @param query The query parameters
   */
  @Get('appointments')
  async getAllAppointments(
    @ActiveUser() merchant: User,
    @Query() query: QueryParamsDto,
  ): Promise<PaginatedRecordsDto<Appointment>> {
    return this.appointmentService.getAllAppointments(merchant.id, query);
  }

  /**
   * Update Appointment
   *
   * Updates the status of an appointment
   *
   * @param merchant The active merchant
   * @param params The appointment ID
   * @param data The update data
   */
  @Patch('appointments/:id')
  async updateAppointement(
    @ActiveUser() merchant: User,
    @Param() params: any,
    @Body() data: UpdateAppointementStatusDto,
  ): Promise<any> {
    const { id } = params;
    return this.appointmentService.manage(+id, merchant, data);
  }
}
