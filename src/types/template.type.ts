export interface ITemplate {
  _id?: string;
  name: string;
  type: "starter" | "event" | "seasonal" | "vip";
  version: string;
  description?: string;
  data: {
    items?: Array<{
      itemId: string;
      itemName: string;
      quantity: number;
    }>;
    koiTypes?: Array<{
      koiTypeId: string;
      koiTypeName: string;
      quantity: number;
    }>;
  };
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TemplateFormData {
  _id?: string;
  name: string;
  type: "starter" | "event" | "seasonal" | "vip";
  version: string;
  description: string;
  data: {
    items: Array<{
      itemId: string;
      itemName: string;
      quantity: number;
    }>;
    koiTypes: Array<{
      koiTypeId: string;
      koiTypeName: string;
      quantity: number;
    }>;
  };
}
