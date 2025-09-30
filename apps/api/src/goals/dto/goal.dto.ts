import { IsEnum, IsString, IsNumber, IsDateString, IsOptional, IsBoolean, Min, Max } from 'class-validator';
import { GoalType, GoalStatus } from '../../entities/goal.entity';

export class CreateGoalDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(GoalType)
  type: GoalType;

  @IsNumber()
  @Min(0.01)
  targetAmount: number;

  @IsDateString()
  targetDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyContribution?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

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

export class UpdateGoalDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(GoalType)
  type?: GoalType;

  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;

  @IsOptional()
  @IsNumber()
  @Min(0.01)
  targetAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  currentAmount?: number;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyContribution?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  icon?: string;

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

export class GoalQueryDto {
  @IsOptional()
  @IsEnum(GoalType)
  type?: GoalType;

  @IsOptional()
  @IsEnum(GoalStatus)
  status?: GoalStatus;

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
