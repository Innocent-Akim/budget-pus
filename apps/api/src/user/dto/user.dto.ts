import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalIncome?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalExpenses?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalSavings?: number;
}
