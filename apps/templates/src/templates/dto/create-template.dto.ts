import { IsArray, IsOptional, IsString } from 'class-validator';
export class CreateTemplateDto {
  @IsString()
  name: string;
  @IsString()
  content: string;
  @IsArray()
  @IsOptional()
  variables?: {
    name: string;
    required?: boolean;
  }[];
}
