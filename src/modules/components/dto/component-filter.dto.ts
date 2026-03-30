import { IsOptional, IsString, IsBoolean, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ComponentFiltersDto {
  @IsOptional()
  @IsString()
  search?: string; // фильтр по title

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minTdpTypical?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxTdpTypical?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  type?: string; // фильтр по типу
}