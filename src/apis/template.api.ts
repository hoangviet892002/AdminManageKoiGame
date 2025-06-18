import type { ITemplate } from "../types/template.type";
import type {
  ApiPaginationResponseType,
  ApiResponseType,
} from "../types/utils.type";
import http from "../utils/http";

export const templateApi = {
  fetchTemplates: async (
    params: Record<string, string | number | boolean | null | undefined>
  ): Promise<ApiPaginationResponseType<ITemplate>> => {
    const stringifiedParams = new URLSearchParams(
      Object.fromEntries(
        Object.entries(params).map(([key, value]) => [key, String(value ?? "")])
      )
    ).toString();
    const response = await http.get(`/templates?${stringifiedParams}`);
    return response.data;
  },

  createTemplate: async (
    template: ITemplate
  ): Promise<ApiResponseType<string>> => {
    const response = await http.post("/templates/add", template);
    return response.data;
  },

  updateTemplate: async (
    id: string,
    template: ITemplate
  ): Promise<ApiResponseType<string>> => {
    const response = await http.put(`/templates/${id}`, template);
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<ApiResponseType<string>> => {
    const response = await http.delete(`/templates/${id}`);
    return response.data;
  },
};
