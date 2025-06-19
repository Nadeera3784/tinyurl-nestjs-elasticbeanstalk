import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { ThrottlerModule } from '@nestjs/throttler';

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
        const isLocal = configService.get<boolean>('database.mongodb.is_local');
        const baseConfig = {
          uri: configService.get<string>('database.mongodb.uri'),
        };
        
        // DocumentDB specific configuration
        if (!isLocal) {
          return {
            ...baseConfig,
            ssl: true,
            sslCA: 'documentdb-ca-bundle.pem',
            retryWrites: false,
            replicaSet: 'rs0',
            readPreference: 'secondaryPreferred',
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
