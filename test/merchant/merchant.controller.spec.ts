import { Test, TestingModule } from '@nestjs/testing';
import { MerchantController } from '../../src/modules/merchants/merchant.controller';
import { AppointmentsService } from '../../src/modules/appointments/appointements.service';
import { ScheduleService } from '../../src/modules/schedules/schedule.service';
import { User } from '../../src/modules/users/entities/user.entity';
import { QueryParamsDto } from '../../src/modules/common/dtos/pagination.dto';
import { UserRole, UserStatus } from '../../src/modules/common/enums/role.enum';
import { v4 } from 'uuid';
import {
  CreateScheduleDefinitionDTO,
  CreateScheduleDto,
} from '../../src/modules/schedules/schedule.dto';
import { Schedule } from '../../src/modules/schedules/entities/schedule.entity';
import { ScheduleTimeSlotStatus } from '../../src/modules/schedules/schedule.enums';
import { TimeSlot } from '../../src/modules/schedules/entities/time-slots.entity';
import { AppointmentStatuses } from '../../src/modules/appointments/appointment.enums';

describe('Merchant Controller', () => {
  let merchantController: MerchantController;
  let appointmentsService: AppointmentsService;
  let scheduleService: ScheduleService;

  const testMerchant: User = {
    id: v4(),
    name: 'Test Merchant',
    email: 'merchant@test.com',
    role: UserRole.MERCHANT,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
    password: '',
    ip: '0.0.0.0',
  };

  const testTimeSlot: TimeSlot = {
    id: 1,
    date: new Date(),
    startTime: '09:00',
    endTime: '13:00',
    status: ScheduleTimeSlotStatus.AVAILABLE,
    merchantId: '9ee2c4ea-75ee-49e8-92b5-b3cec5cedc0a',
    createdAt: new Date(),
    updatedAt: new Date(),
    schedule: new Schedule(),
    merchant: new User(),
  };

  const testSchedule: Partial<Schedule> = {
    startDate: new Date(),
    endDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    timeslots: [testTimeSlot],
  };

  const _queryParams = new QueryParamsDto();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MerchantController],
      providers: [
        {
          provide: AppointmentsService,
          useValue: {
            getAllAppointments: jest.fn(),
            manage: jest.fn(),
          },
        },
        {
          provide: ScheduleService,
          useValue: {
            createSchedule: jest.fn(),
            getAllScheduleDefinitions: jest.fn(),
            createSchdeuleDefinition: jest.fn(),
            getMerchantAvailableTimeslots: jest.fn(),
          },
        },
      ],
    }).compile();

    merchantController = module.get<MerchantController>(MerchantController);
    appointmentsService = module.get<AppointmentsService>(AppointmentsService);
    scheduleService = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(merchantController).toBeDefined();
  });

  describe('createSchedule', () => {
    it('should call scheduleService.createSchedule with correct parameters', async () => {
      const createScheduleDto: CreateScheduleDto = {
        startDate: new Date(),
        endDate: new Date(),
        templateId: 1,
      };

      await merchantController.createSchedule(testMerchant, createScheduleDto);

      expect(scheduleService.createSchedule).toHaveBeenCalledWith(testMerchant, createScheduleDto);
    });
  });

  describe('getAllSchdeuleDefinitions', () => {
    it('should call scheduleService.getAllScheduleDefinitions with correct parameters', async () => {
      await merchantController.getAllSchdeuleDefinitions(testMerchant);

      expect(scheduleService.getAllScheduleDefinitions).toHaveBeenCalledWith(testMerchant);
    });
  });

  describe('createScheduleDefinition', () => {
    it('should call scheduleService.createSchdeuleDefinition with correct parameters', async () => {
      const createScheduleDefinitionDto: CreateScheduleDefinitionDTO = {
        timeslots: [],
      };

      await merchantController.createScheduleDefinition(testMerchant, createScheduleDefinitionDto);

      expect(scheduleService.createSchdeuleDefinition).toHaveBeenCalledWith(
        testMerchant,
        createScheduleDefinitionDto,
      );
    });
  });

  describe('getAllAppointments', () => {
    it('should getAllAppointments  for merchant', async () => {
      const queryParams = _queryParams;

      await merchantController.getAllAppointments(testMerchant, queryParams);

      expect(appointmentsService.getAllAppointments).toHaveBeenCalledWith(
        testMerchant.id,
        queryParams,
      );
    });
  });

  describe('updateAppointement', () => {
    it('should call appointmentService.manage with correct parameters', async () => {
      const params = { id: '1' };
      const updateAppointementStatusDto = {
        status: AppointmentStatuses.CONFIRMED,
      };

      await merchantController.updateAppointement(
        testMerchant,
        params,
        updateAppointementStatusDto,
      );

      expect(appointmentsService.manage).toHaveBeenCalledWith(
        +params.id,
        testMerchant,
        updateAppointementStatusDto,
      );
    });
  });
});
