import { Injectable, HttpStatus } from '@nestjs/common';
import { Feature } from '../../app/features/feature';
import { UrlService } from '../services';

@Injectable()
export class GetUrlStatsFeature extends Feature {
  constructor(private readonly urlService: UrlService) {
    super();
  }

  public async handle(id: string) {
    try {
      const stats = await this.urlService.getStats(id);
      return this.responseSuccess(
        HttpStatus.OK,
        'URL statistics retrieved successfully',
        stats,
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
