import React, {
  createContext,
  useState,
  useContext,
  type ReactNode,
  useEffect,
  useCallback,
} from "react";
import type { IUser } from "../payload/response/auth.request";
import type { LoginRequestType } from "../payload/request/auth.request";
import { authApi } from "../apis/auth.api";
import http from "../utils/http";
import { useMessage } from "./message.context";
import { useNavigate } from "react-router-dom";

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginRequestType) => Promise<void>;
  logout: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  logout: async () => {},
};
const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { showMessage } = useMessage();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error("Error loading user from storage:", err);
      }
    };
    loadUser();
  }, []);
  const login = useCallback(
    async (data: LoginRequestType) => {
      try {
        setLoading(true);
        setError(null);
        const response = await authApi.login(data);
        console.log("response", response);
        if (response.isSuccess) {
          // Save user data and token
          setUser(response.data);
          await localStorage.setItem("user", JSON.stringify(response.data));
          await localStorage.setItem("token", response.data.token);
          http.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.token}`;
          showMessage("success", response.message || "Login success");
        } else {
          showMessage("error", response.message || "Login failed");
        }
      } catch (err: any) {
        showMessage("error", err.message || "Failed to login");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [showMessage]
  );

  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Clear user data from state and storage
      setUser(null);
      await localStorage.removeItem("user");
      // Clear token from axios headers
      delete http.defaults.headers.common["Authorization"];
      showMessage("success", "Logout success");
    } catch (err: any) {
      setError(err.message || "Failed to logout");
      showMessage("error", err.message || "Failed to logout");
    } finally {
      setLoading(false);
    }
  }, [showMessage]);
  const value = {
    user,
    loading,
    error,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
