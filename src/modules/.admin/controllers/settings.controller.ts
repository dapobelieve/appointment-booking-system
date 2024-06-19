import { Body, Controller, Get, Post } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { CreateSettingDto } from '../dtos/settings.dto';

@Controller('v1/admin')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get('settings')
  async getSettings(): Promise<any> {
    return this.settingsService.get();
  }

  @Post('settings')
  async set(@Body() data: CreateSettingDto): Promise<any> {
    return this.settingsService.set(data);
  }
}
