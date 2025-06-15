import type { LoginRequestType } from "../payload/request/auth.request";
import type { IUser } from "../payload/response/auth.request";
import type { ApiResponseType } from "../types/utils.type";
import http from "../utils/http";

export const authApi = {
  login: async (data: LoginRequestType): Promise<ApiResponseType<IUser>> => {
    const response = await http.post(`/auth/login`, data);
    return response.data;
  },
};
