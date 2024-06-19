import { TransactionService } from '../../transactions/txn.service';
import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { PaginatedRecordsDto, QueryParamsDto } from '../../common/dtos/pagination.dto';
import { Transaction } from '../../transactions/entities/txn.entity';
import { Roles } from '../../iam/authorization/decorators/role.decorator';
import { UserRole } from '../../common/enums/role.enum';
import { ApproveTxnDto } from '../dtos/txn.dto';
import { ActiveUser } from '../../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../../iam/interfaces/active-user.interface';

@Roles(UserRole.ADMIN)
@Controller('v1/admin/transactions')
export class TransactionController {
  constructor(private readonly txnService: TransactionService) {}

  @Get(':id')
  async getTransaction(@Param('id') id: string): Promise<Transaction | null> {
    return this.txnService.getOne(id);
  }

  @Patch(':id/approve')
  async approveOrRejectTransaction(
    @ActiveUser() adminUser: ActiveUserData,
    @Param('id') id: string,
    @Body() data: ApproveTxnDto,
  ): Promise<any> {
    return this.txnService.approveOrReject(id, data, adminUser);
  }

  @Get()
  async allTransactions(@Query() query: QueryParamsDto): Promise<PaginatedRecordsDto<Transaction>> {
    return this.txnService.all(query);
  }
}
