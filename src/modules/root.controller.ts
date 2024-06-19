import { Controller, Get, Redirect } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class RootController {
  constructor() {}
  /**
   * Redirects the base URL to the health check endpoint
   * @returns
   */
  @Get('health-check')
  @Redirect('/health-check', 308)
  redirectBaseUrlToHealthCheck() {
    return 'unimplemented';
  }
}
