import { Navigate } from "react-router-dom";
import { useUserContext } from "../contexts/userContext";
import type { JSX } from "react";

export const AuthRoute = ({ children }: { children: JSX.Element }) => {
  const { userContext, isLoading } = useUserContext();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!userContext.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};