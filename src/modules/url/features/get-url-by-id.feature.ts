import { Injectable, HttpStatus } from '@nestjs/common';
import { Feature } from '../../app/features/feature';
import { UrlService } from '../services';

@Injectable()
export class GetUrlByIdFeature extends Feature {
  constructor(private readonly urlService: UrlService) {
    super();
  }

  public async handle(id: string) {
    try {
      const url = await this.urlService.getById(id);
      return this.responseSuccess(
        HttpStatus.OK,
        'URL retrieved successfully',
        url,
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
