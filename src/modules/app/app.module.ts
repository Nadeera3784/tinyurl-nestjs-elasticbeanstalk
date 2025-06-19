import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
import { UrlModule } from '../url/url.module';
import * as path from 'path';
import { AppEnvironmentEnum } from './enums';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      cache: false,
    }),

    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const appEnvironment = configService.get<string>('app.app_env');
        const uri = configService.get<string>('database.mongodb.uri');
        const baseConfig = {
          uri,
        };
        if (appEnvironment === AppEnvironmentEnum.PRODUCTION) {
          const certPath = path.join(process.cwd(), 'global-bundle.pem');
          return {
            ...baseConfig,
            tls: true,
            tlsCAFile: certPath,
          };
        }
        return baseConfig;
      },
      inject: [ConfigService],
    }),
    ThrottlerModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>('throttler.ttl') || 60,
            limit: configService.get<number>('throttler.limit') || 10,
          },
        ],
      }),
      inject: [ConfigService],
    }),
    UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService, HealthService],
})
export class AppModule implements OnApplicationShutdown {
  onApplicationShutdown(signal?: string) {
    Logger.debug(`Application shut down (signal: ${signal})`);
  }
}
