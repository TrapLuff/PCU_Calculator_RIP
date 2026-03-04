export interface BuildDTO {
  buildID: number; // или id
  componentsCount: number;
  components: {
    id: number;
    title: string;
    image?: string;
    tdp_up: number;
    tdp_typical: number;
    quantity: number;
  }[];
  upTotal: number;
  typicalTotal: number;
  efficiency: number;
  recommendedPower: number;
}