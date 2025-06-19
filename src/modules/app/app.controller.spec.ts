import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthService } from './services';
import { ConfigService } from '@nestjs/config';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const mockConfigService = {
      get: jest
        .fn()
        .mockImplementation((key: string): string | number | boolean => {
          const config: Record<string, string | number | boolean> = {
            'app.app_name': 'tinyurl',
            'app.app_port': 8080,
            'database.mongodb.is_local': true,
            'throttler.ttl': 60,
            'throttler.limit': 10,
          };
          return config[key];
        }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        HealthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });

  describe('health', () => {
    it('should return health status', () => {
      const result = appController.getHealth();
      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('environment');
      expect(result).toHaveProperty('config');
      expect(result.config).toHaveProperty('app_name', 'tinyurl');
      expect(result.config).toHaveProperty('app_port', 8080);
      expect(result.config).toHaveProperty('mongodb_is_local', true);
      expect(result.config).toHaveProperty('throttler_ttl', 60);
      expect(result.config).toHaveProperty('throttler_limit', 10);
    });
  });
});
