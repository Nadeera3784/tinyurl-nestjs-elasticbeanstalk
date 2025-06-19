import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthService } from './services';
//import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from '../../config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';
//import { UrlModule } from '../url/url.module';
//import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
      load: [configuration],
      cache: false,
    }),
    /*
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const isLocal = configService.get<boolean>('database.mongodb.is_local');
        const uri = configService.get<string>('database.mongodb.uri');

        console.log(
          `MongoDB Configuration - isLocal: ${isLocal}, NODE_ENV: ${process.env.NODE_ENV}`,
        );

        const baseConfig = {
          uri,
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 30000,
          socketTimeoutMS: 45000,
        };

        if (!isLocal) {
          const certPath = path.join(process.cwd(), 'documentdb-ca-bundle.pem');
          console.log(
            `Using production MongoDB config with certificate at: ${certPath}`,
          );

          return {
            ...baseConfig,
            ssl: true,
            sslCA: certPath,
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
    */
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
export class AppModule {}
