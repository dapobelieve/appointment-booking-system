import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { SettingsRepository } from '../../settings/settings.repository';
import { CreateSettingDto } from '../dtos/settings.dto';
const slug = require('slug');

@Injectable({ scope: Scope.REQUEST })
export class SettingsService {
  private settings: Map<string, any> = new Map();

  constructor(private readonly settingsRepo: SettingsRepository) {}

  async set(data: CreateSettingDto) {
    let { name, value } = data;

    name = slug(name.trim().toUpperCase(), {
      replacement: '_',
      trim: true,
      lower: false,
    });

    await this.settingsRepo.setKey(name, value);
    await this.loadSettings();
  }

  private async loadSettings(): Promise<void> {
    console.log('loading settings');
    const settings = await this.settingsRepo.getAllSettings();
    settings.forEach((s) => {
      this.settings.set(s.name, s.value);
    });
  }

  async get(key?: string) {
    if (!this.settings.size) {
      await this.loadSettings();
    }

    if (key) {
      if (this.settings.has(key)) {
        return this.settings.get(key);
      } else {
        throw new BadRequestException(`Key ${key} does not exist`);
      }
    } else {
      return Array.from(this.settings).reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    }
  }
}
