import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
export class CreateTemplateDto {
  @IsString()
  name: string;
  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return [];
    }
  })
  variables?: Array<{ name: string; required: boolean }>;
}
