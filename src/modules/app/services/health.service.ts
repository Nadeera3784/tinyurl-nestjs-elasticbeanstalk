import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getHealthStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('app.app_name'),
      config: {
        app_name: this.configService.get<string>('app.app_name'),
        throttler_ttl: this.configService.get<number>('throttler.ttl'),
        throttler_limit: this.configService.get<number>('throttler.limit'),
      },
    };
  }
}
