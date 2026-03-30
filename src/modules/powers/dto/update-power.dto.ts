import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdatePowerDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  efficiency?: number;

  @IsOptional()
  @IsString()
  description?: string;
}