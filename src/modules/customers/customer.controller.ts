import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointements.service';
import { Auth } from '../iam/authentication/decorators/auth.decorator';
import { AuthType } from '../iam/authentication/enums/auth-type.enums';
import { Roles } from '../iam/authorization/decorators/role.decorator';
import { SwaggerApiTagsEnum, UserRole } from '../common/enums/role.enum';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserService } from '../users/services/user.service';
import { PaginatedRecordsDto, QueryParamsDto } from '../common/dtos/pagination.dto';
import { ScheduleService } from '../schedules/schedule.service';
import { CreateBookingDto } from '../appointments/appointment.dto';
import { ApiTags } from '@nestjs/swagger';

@Auth(AuthType.Bearer)
@Roles(UserRole.CUSTOMER)
@ApiTags(SwaggerApiTagsEnum.CUSTOMERS)
@Controller('v1/customers')
export class CustomerController {
  constructor(
    private readonly userService: UserService,
    private readonly appointmentService: AppointmentsService,
    private readonly scheduleService: ScheduleService,
  ) {}

  @Get('merchants')
  async getAllMerchants() {
    const query: QueryParamsDto = new QueryParamsDto();
    query.role = 'MERCHANT';
    return this.userService.getAllUsers(query);
  }

  @Get('merchants/:merchantId/schedules')
  async getMerchantSchedule(@Param() params: any): Promise<PaginatedRecordsDto<User>> {
    const { merchantId } = params;
    return this.scheduleService.getMerchantAvailableTimeslots(merchantId);
  }

  /**
   * Book an appointment.
   * @param customer - The currently authenticated customer.
   * @param data - The booking data.
   * @returns The result of the booking creation.
   */
  @Post('appointments/book')
  async bookAppointment(
    @ActiveUser() customer: User,
    @Body() data: CreateBookingDto,
  ): Promise<any> {
    return this.appointmentService.createBooking(customer, data);
  }

  @Get('appointments')
  async appointments(@ActiveUser() customer: User, @Query() query: QueryParamsDto): Promise<any> {
    return this.appointmentService.getAllAppointments(customer.id, query);
  }

  @Post('appointments/:id/finalize')
  async finalizeAppointment(@ActiveUser() customer: User, @Param() params: any): Promise<any> {
    const { id } = params;
    return this.appointmentService.finalize(+id, customer);
  }
}
