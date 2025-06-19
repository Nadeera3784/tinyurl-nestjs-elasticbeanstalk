import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthService } from './services';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
//import { UrlModule } from '../url/url.module';
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

        console.log(
          `MongoDB Configuration - appEnvironment: ${appEnvironment}`,
        );

        const baseConfig = {
          uri,
        };

        if (appEnvironment === AppEnvironmentEnum.PRODUCTION) {
          const certPath = path.join(process.cwd(), 'global-bundle.pem');
          console.log(
            `Using production MongoDB config with certificate at: ${certPath}`,
          );

          return {
            ...baseConfig,
            tls: true,
            tlsCAFile: certPath,
            retryWrites: false,
            replicaSet: 'rs0',
            readPreference: 'secondaryPreferred',
          };
        }

        console.log('Using local MongoDB config');
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
    //UrlModule,
  ],
  controllers: [AppController],
  providers: [AppService, HealthService],
})
export class AppModule implements OnApplicationBootstrap {
  constructor(private readonly healthService: HealthService) {}
  onApplicationBootstrap() {
    console.log(this.healthService.getHealthStatus());
  }
}
