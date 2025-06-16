import type { KoiBreedType } from "../types/koi-breed.type";
import type { ApiPaginationResponseType } from "../types/utils.type";
import http from "../utils/http";

export const koiBreedApi = {
  fetchKoiTypes: async (
    params: Record<string, any>
  ): Promise<ApiPaginationResponseType<KoiBreedType>> => {
    const stringifiedParams = new URLSearchParams(params).toString();
    const response = await http.get(`/koi-breeds?${stringifiedParams}`);
    return response.data;
  },
};
