export interface PowerComponentDto {
  id: number;
  title: string;
  isActive: boolean;
  image?: string | null;
  tdp_up: number;
  tdp_typical: number;
  quantity: number;
}

export interface PowerResponseDto {
  powerId: number;
  status: string;
  componentsCount: number;
  components: PowerComponentDto[];
  upTotal: number;
  typicalTotal: number;
  efficiency: number;
  recommendedPower: number;
}

export class PowerListResponseDto {
  id: number;
  userName: string;
  moderatorName: string | null;
  status: string;
  createdAt: Date | null;
  formedAt: Date;
  completedAt: Date | null;
  componentsCount: number;
  upTotal: number;
  recommendedPower: number;
}