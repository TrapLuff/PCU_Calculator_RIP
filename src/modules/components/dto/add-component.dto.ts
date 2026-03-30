import { IsInt, Min } from 'class-validator';

export class AddComponentDto {
  @IsInt()
  componentId: number;

  @IsInt()
  @Min(1)
  quantity: number;
}