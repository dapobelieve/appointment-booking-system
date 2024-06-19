import { Injectable } from '@nestjs/common';
import { UserService } from '../users/services/user.service';
import { PackageService } from '../packages/package.service';
import { DeliveryService } from '../deliveries/services/delivery.service';
import { RedisService } from '../redis/redis.service';
import { QueryParamsDto } from '../common/dtos/pagination.dto';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class AdminService {
  constructor(
    private readonly userService: UserService,
    private readonly packageService: PackageService,
    private readonly deliveryService: DeliveryService,
    private readonly redisService: RedisService,
  ) {}

  async activateCourier() {}

  private async recentDeliveries(query: QueryParamsDto) {
    return this.deliveryService.adminDeliveries(query);
  }

  async getRecentDeliveries(query: QueryParamsDto) {
    return this.recentDeliveries(query);
  }

  async getStats() {
    const [packages, deliveries, couriers, onlineCouriers] = await Promise.all([
      this.packageService.allAdminPackages(),
      this.deliveryService.getAdminDeliveries(),
      this.userService.getAdminCourierUsers(),
      this.redisService.getOnlineCouriers(),
      // this.recentDeliveries(),
    ]);

    return {
      packages,
      deliveries,
      couriers,
      onlineCouriers: onlineCouriers.length,
    };
  }
}
