import { Injectable, HttpStatus } from '@nestjs/common';
import { Feature } from '../../app/features/feature';
import { UrlService } from '../services';

@Injectable()
export class DeleteUrlFeature extends Feature {
  constructor(private readonly urlService: UrlService) {
    super();
  }

  public async handle(id: string) {
    try {
      const data = await this.urlService.delete(id);
      return this.responseSuccess(HttpStatus.OK, 'URL has been deleted', data);
    } catch (error) {
      return this.responseError(
        HttpStatus.BAD_REQUEST,
        'Something went wrong. please try again later',
        error,
      );
    }
  }
}
