import { Injectable, HttpStatus } from '@nestjs/common';
import { Feature } from '../../app/features/feature';
import { UrlService } from '../services';

@Injectable()
export class RedirectUrlFeature extends Feature {
  constructor(private readonly urlService: UrlService) {
    super();
  }

  public async handle(shortCode: string) {
    try {
      const url = await this.urlService.getByShortCode(shortCode);

      this.urlService.incrementClickCount(shortCode).catch(() => {
        // Silently handle click count update errors
      });

      return this.responseSuccess(HttpStatus.FOUND, 'Redirect URL found', {
        original_url: url.original_url,
        short_code: url.short_code,
        click_count: url.click_count + 1,
      });
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong, Please try again later',
        error,
      );
    }
  }
}
