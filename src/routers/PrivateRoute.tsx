import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/auth.context";

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string; // ví dụ: "/dashboard"
  isAuthPage?: boolean; // bật khi dùng cho trang login
}

const PrivateRoute = ({
  children,
  redirectTo = "/",
  isAuthPage = false,
}: PrivateRouteProps) => {
  const { user } = useAuth();

  if (isAuthPage) {
    return user ? <Navigate to={redirectTo} replace /> : <>{children}</>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
