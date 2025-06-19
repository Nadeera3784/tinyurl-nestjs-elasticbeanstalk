import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { Document, now } from 'mongoose';
import { UrlStatusEnum } from '../enums';

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Url extends Document {
  @Prop({ required: true })
  @IsNotEmpty()
  @IsUrl()
  original_url: string;

  @Prop({ required: true, unique: true })
  @IsNotEmpty()
  short_code: string;

  @Prop({ default: UrlStatusEnum.ACTIVE, enum: UrlStatusEnum })
  @IsOptional()
  status: UrlStatusEnum;

  @Prop({ default: 0 })
  @IsOptional()
  click_count: number;

  @Prop()
  @IsOptional()
  expires_at: Date;

  @Prop({ default: now() })
  @IsOptional()
  created_at: Date;

  @Prop({ default: now() })
  @IsOptional()
  updated_at: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);

UrlSchema.index({ original_url: 1 });
UrlSchema.index({ status: 1 });
