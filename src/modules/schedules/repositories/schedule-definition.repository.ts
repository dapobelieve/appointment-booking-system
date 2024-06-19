import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScheduleDefinition } from '../entities/schedule-definitions.entity';

@Injectable()
export class ScheduleDefinitionRepository {
  constructor(
    @InjectRepository(ScheduleDefinition)
    private readonly _scheduleDef: Repository<ScheduleDefinition>,
  ) {}

  async create(scheduleDefData: Partial<ScheduleDefinition>): Promise<ScheduleDefinition> {
    const newScheduleDef = this._scheduleDef.create({
      ...scheduleDefData,
    });
    return this._scheduleDef.save(newScheduleDef);
  }

  async findOne(id: number): Promise<ScheduleDefinition | null> {
    return this._scheduleDef.findOne({ where: { id, deletedAt: null } });
  }

  async findAllByMerchantId(merchantId: string): Promise<ScheduleDefinition[]> {
    return this._scheduleDef.find({ where: { merchantId: merchantId, deletedAt: null } });
  }

  async delete(id: number): Promise<void> {
    await this._scheduleDef.update(id, { deletedAt: new Date() });
  }
}
