import { Injectable, HttpStatus } from '@nestjs/common';
import { Feature } from '../../app/features/feature';
import { UrlService } from '../services';
import { CreateUrlDto } from '../dtos';

@Injectable()
export class CreateUrlFeature extends Feature {
  constructor(private readonly urlService: UrlService) {
    super();
  }

  public async handle(createUrlDto: CreateUrlDto) {
    try {
      const url = await this.urlService.create(createUrlDto);
      return this.responseSuccess(
        HttpStatus.CREATED,
        'Short URL created successfully',
        {
          id: url._id,
          original_url: url.original_url,
          short_code: url.short_code,
          short_url: `${process.env.BASE_URL || 'http://localhost:3000'}/${url.short_code}`,
          status: url.status,
          expires_at: url.expires_at,
          created_at: url.created_at,
        },
      );
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong. please try again later',
        error,
      );
    }
  }
}
