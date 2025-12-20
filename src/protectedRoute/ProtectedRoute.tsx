//Common Shared component to protect Route from unAuthorized user.

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { ProtectedRouteProps } from "@/types";

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  isAuthenticated,
  redirectPath = "/login",
  children,
}) => {
  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
