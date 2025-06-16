export interface KoiBreedType {
  _id: string;
  breedName: string;
  description: string;
  basePrice: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  baseGrowthRate: number;
  imgUrl: string;
  __v: number;
}
