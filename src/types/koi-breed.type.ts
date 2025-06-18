export interface KoiBreedType {
  _id?: string;
  breedName: string;
  description: string;
  basePrice: number;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  baseGrowthRate: number;
  imgUrl?: string;
  __v?: number;
}
