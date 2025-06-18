import type { ItemType } from "../types/ItemType";
import type {
  ApiPaginationResponseType,
  ApiResponseType,
} from "../types/utils.type";
import http from "../utils/http";

export const itemApi = {
  fetchItems: async (
    params: Record<string, string | number | boolean | null | undefined>
  ): Promise<ApiPaginationResponseType<ItemType>> => {
    const stringifiedParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value ?? "")])
      )
    ).toString();
    console.log(stringifiedParams);
    const response = await http.get(`/items?${stringifiedParams}`);
    return response.data;
  },

  createItem: async (item: ItemType): Promise<ApiResponseType<string>> => {
    const response = await http.post("/items/add", item);
    return response.data;
  },

  updateItem: async (
    id: string,
    item: ItemType
  ): Promise<ApiResponseType<string>> => {
    const response = await http.put(`/items/${id}`, item);
    return response.data;
  },
  deleteItem: async (id: string): Promise<ApiResponseType<string>> => {
    const response = await http.delete(`/items/${id}`);
    return response.data;
  },
};
