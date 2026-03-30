export interface PowerDTO {
  powerID: number; // или id
  status: string;
  upTotal: number;
  typicalTotal: number;
  efficiency: number;
  recommendedPower: number;
  componentsCount: number;
  components: {
    id: number;
    title: string;
    image?: string;
    tdp_up: number;
    tdp_typical: number;
    quantity: number;
  }[];
  
}