import { IsOptional, IsUrl, IsDateString } from 'class-validator';
import { UrlStatusEnum } from '../enums';

export class UpdateUrlDto {
  @IsUrl()
  @IsOptional()
  original_url?: string;

  @IsOptional()
  status?: UrlStatusEnum;

  @IsDateString()
  @IsOptional()
  expires_at?: Date;
}
