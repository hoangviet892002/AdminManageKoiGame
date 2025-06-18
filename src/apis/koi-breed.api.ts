import type { KoiBreedType } from "../types/koi-breed.type";
import type {
  ApiPaginationResponseType,
  ApiResponseType,
} from "../types/utils.type";
import http from "../utils/http";

export const koiBreedApi = {
  fetchKoiTypes: async (
    params: Record<string, string | number | boolean>
  ): Promise<ApiPaginationResponseType<KoiBreedType>> => {
    const stringifiedParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value)])
      )
    ).toString();
    const response = await http.get(`/koi-breeds?${stringifiedParams}`);
    return response.data;
  },

  createKoiBreed: async (
    koiBreed: KoiBreedType
  ): Promise<ApiResponseType<string>> => {
    const response = await http.post("/koi-breeds/add", koiBreed);
    return response.data;
  },
  updateKoiBreed: async (
    id: string,
    koiBreed: KoiBreedType
  ): Promise<ApiResponseType<string>> => {
    const response = await http.put(`/koi-breeds/update/${id}`, koiBreed);
    return response.data;
  },

  deleteKoiBreed: async (id: string): Promise<ApiResponseType<string>> => {
    const response = await http.delete(`/koi-breeds/delete/${id}`);
    return response.data;
  },
};
