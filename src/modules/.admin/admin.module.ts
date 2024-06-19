import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CourierController } from './controllers/courier.controller';
import { UserModule } from '../users/user.module';
import { PackageModule } from '../packages/package.module';
import { PackageController } from './controllers/package.controller';
import { AdminController } from './controllers/admin.controller';
import { DeliveryModule } from '../deliveries/delivery.module';
import { TransactionController } from './controllers/txn.controller';
import { TransactionService } from '../transactions/txn.service';
import { TxnRepository } from '../transactions/txn.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/entities/txn.entity';
import { TxnModule } from '../transactions/txn.module';
import { SettingsController } from './controllers/settings.controller';
import { SettingsService } from './services/settings.service';
import { Settings } from '../settings/entities/settings.entity';
import { SettingsRepository } from '../settings/settings.repository';

@Module({
  imports: [
    UserModule,
    PackageModule,
    DeliveryModule,
    TxnModule,
    TypeOrmModule.forFeature([Settings]),
  ],
  controllers: [
    CourierController,
    PackageController,
    AdminController,
    TransactionController,
    SettingsController,
  ],
  providers: [AdminService, SettingsService, SettingsRepository],
  exports: [],
})
export class AdminModule {}
