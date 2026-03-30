import { IsOptional, IsString, IsDateString } from 'class-validator';

export class PowerFiltersDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;
}