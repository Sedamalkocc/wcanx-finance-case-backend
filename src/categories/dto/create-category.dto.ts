import { IsNotEmpty, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  priority?: number;
}
