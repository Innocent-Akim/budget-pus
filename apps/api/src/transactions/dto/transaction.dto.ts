import { IsEnum, IsString, IsNumber, IsDateString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { TransactionType, TransactionCategory } from '../../entities/transaction.entity';

export class CreateTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @IsEnum(TransactionCategory)
  category: TransactionCategory;

  @IsNumber()
  @Min(0.01)
  amount: number;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringPattern?: string;

  @IsOptional()
  @IsDateString()
  recurringEndDate?: string;
}

export class UpdateTransactionDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionCategory)
  category?: TransactionCategory;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  tags?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringPattern?: string;

  @IsOptional()
  @IsDateString()
  recurringEndDate?: string;
}

export class TransactionQueryDto {
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @IsOptional()
  @IsEnum(TransactionCategory)
  category?: TransactionCategory;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
