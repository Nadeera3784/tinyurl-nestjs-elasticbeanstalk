import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Url } from '../schemas';
import { CreateUrlDto, UpdateUrlDto } from '../dtos';
import { UrlStatusEnum } from '../enums';
import { ShortCodeUtil } from '../utils/short-code.util';

@Injectable()
export class UrlService {
  constructor(
    @InjectModel(Url.name)
    private readonly urlModel: Model<Url>,
  ) {}

  public async getAll(status?: UrlStatusEnum) {
    const filter = status ? { status } : {};
    return await this.urlModel
      .find(filter)
      .select('-__v')
      .sort({ created_at: -1 });
  }

  public async getById(id: string) {
    const url = await this.urlModel.findById(id).select('-__v');
    if (!url) {
      throw new NotFoundException('URL not found');
    }
    return url;
  }

  public async getByShortCode(shortCode: string) {
    const url = await this.urlModel
      .findOne({
        short_code: shortCode,
        status: UrlStatusEnum.ACTIVE,
      })
      .select('-__v');

    if (!url) {
      throw new NotFoundException('Short URL not found or inactive');
    }

    // Check if URL has expired
    if (url.expires_at && new Date() > url.expires_at) {
      throw new NotFoundException('Short URL has expired');
    }

    return url;
  }

  public async create(createUrlDto: CreateUrlDto) {
    let shortCode: string;

    if (createUrlDto.custom_short_code) {
      shortCode = ShortCodeUtil.clean(createUrlDto.custom_short_code);

      if (!ShortCodeUtil.isValid(shortCode)) {
        throw new ConflictException('Invalid custom short code format');
      }

      const existingUrl = await this.urlModel.findOne({
        short_code: shortCode,
      });
      if (existingUrl) {
        throw new ConflictException('Custom short code already exists');
      }
    } else {
      shortCode = await this.generateUniqueShortCode();
    }

    const newUrl = await this.urlModel.create({
      original_url: createUrlDto.original_url,
      short_code: shortCode,
      status: createUrlDto.status || UrlStatusEnum.ACTIVE,
      expires_at: createUrlDto.expires_at,
    });

    return newUrl.toObject();
  }

  public async update(id: string, updateUrlDto: UpdateUrlDto) {
    const url = await this.urlModel
      .findByIdAndUpdate(
        id,
        { ...updateUrlDto, updated_at: new Date() },
        { new: true, runValidators: true },
      )
      .select('-__v');

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    return url;
  }

  public async delete(id: string) {
    return await this.urlModel.deleteOne({ _id: id });
  }

  public async incrementClickCount(shortCode: string) {
    return await this.urlModel.findOneAndUpdate(
      { short_code: shortCode },
      { $inc: { click_count: 1 } },
      { new: true },
    );
  }

  public async getStats(id: string) {
    return await this.getById(id);
  }

  private async generateUniqueShortCode(): Promise<string> {
    let shortCode: string;
    let attempts = 0;
    const maxAttempts = 10;
    do {
      shortCode = ShortCodeUtil.generate();
      const existingUrl = await this.urlModel.findOne({
        short_code: shortCode,
      });

      if (!existingUrl) {
        return shortCode;
      }

      attempts++;
    } while (attempts < maxAttempts);

    shortCode = ShortCodeUtil.generate(12);
    return shortCode;
  }
}
