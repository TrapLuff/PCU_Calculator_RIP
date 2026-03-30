import { IsInt, Min, IsOptional } from 'class-validator';

export class UpdateComponentPowerDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  quantity?: number;
}