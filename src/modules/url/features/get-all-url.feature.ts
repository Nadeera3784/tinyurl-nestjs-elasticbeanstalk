import { Injectable, HttpStatus } from '@nestjs/common';
import { Feature } from '../../app/features/feature';
import { UrlService } from '../services';

@Injectable()
export class GetAllUrlsFeature extends Feature {
  constructor(private readonly urlService: UrlService) {
    super();
  }
  public async handle() {
    try {
      const data = await this.urlService.getAll();
      return this.responseSuccess(
        HttpStatus.OK,
        'Urls fetched successfully',
        data,
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
