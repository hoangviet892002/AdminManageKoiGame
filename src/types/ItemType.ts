export interface ItemType {
  _id?: string;
  name: string;
  type: "food" | "medicine" | "upgrade" | "decoration" | "special";
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  description: string;
  price: {
    coins: number;
    gems?: number;
  };
  effects: {
    health?: number;
    happiness?: number;
    energy?: number;
    growth?: number;
    breeding?: number;
    environment?: {
      temperature?: number;
      pH?: number;
      oxygen?: number;
      cleanliness?: number;
    };
  };
  duration?: number; // Duration in hours for temporary effects
  stackable: boolean;
  maxStack?: number;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
