import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsDateString,
} from 'class-validator';
import { UrlStatusEnum } from '../enums';

export class CreateUrlDto {
  @IsUrl()
  @IsNotEmpty()
  original_url: string;

  @IsString()
  @IsOptional()
  custom_short_code?: string;

  @IsOptional()
  status?: UrlStatusEnum;

  @IsDateString()
  @IsOptional()
  expires_at?: Date;
}
