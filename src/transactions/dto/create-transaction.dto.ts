import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, IsEnum } from 'class-validator';

export class CreateTransactionDto {
  @IsEnum(['income', 'expense'])
  type: 'income' | 'expense';

  @IsNumber()
  amount: number;

  @IsMongoId()
  categoryId: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  date?: Date;
}
