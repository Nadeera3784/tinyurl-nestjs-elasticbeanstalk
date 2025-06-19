import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(private readonly configService: ConfigService) {}

  getHealthStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      config: {
        app_name: this.configService.get<string>('app.app_name'),
        app_port: this.configService.get<number>('app.app_port'),
        mongodb_is_local: this.configService.get<boolean>(
          'database.mongodb.is_local',
        ),
        throttler_ttl: this.configService.get<number>('throttler.ttl'),
        throttler_limit: this.configService.get<number>('throttler.limit'),
      },
    };
  }
}
