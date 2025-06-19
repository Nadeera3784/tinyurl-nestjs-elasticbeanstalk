import { Injectable, HttpStatus } from '@nestjs/common';
import { Feature } from '../../app/features/feature';
import { UrlService } from '../services';
import { UpdateUrlDto } from '../dtos';

@Injectable()
export class UpdateUrlFeature extends Feature {
  constructor(private readonly urlService: UrlService) {
    super();
  }

  public async handle(id: string, updateUrlDto: UpdateUrlDto) {
    try {
      const url = await this.urlService.update(id, updateUrlDto);
      return this.responseSuccess(
        HttpStatus.OK,
        'URL updated successfully',
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
