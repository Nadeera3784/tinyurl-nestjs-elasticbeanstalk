import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UrlService } from './services';
import {
  GetAllUrlsFeature,
  CreateUrlFeature,
  RedirectUrlFeature,
  GetUrlStatsFeature,
  GetUrlByIdFeature,
  UpdateUrlFeature,
  DeleteUrlFeature,
} from './features';
import { UrlController, RedirectController } from './controllers';
import { Url, UrlSchema } from './schemas';

@Module({
  imports: [MongooseModule.forFeature([{ name: Url.name, schema: UrlSchema }])],
  controllers: [UrlController, RedirectController],
  providers: [
    UrlService,
    GetAllUrlsFeature,
    CreateUrlFeature,
    RedirectUrlFeature,
    GetUrlStatsFeature,
    GetUrlByIdFeature,
    UpdateUrlFeature,
    DeleteUrlFeature,
  ],
  exports: [UrlService],
})
export class UrlModule {}
