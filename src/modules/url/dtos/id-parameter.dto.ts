import { IsString, IsNotEmpty, IsMongoId } from 'class-validator';

export class IdParameterDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  id: string;
}
