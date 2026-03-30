export class PowerFinalizeResponseDto {
    powerId: number;
    status: string;
    completedAt: Date;
    componentsCount: number;
    upTotal: number;
    efficiency: number;
    recommendedPower: number;
    quantity?: number;
}