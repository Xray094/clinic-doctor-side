import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const currentRole = user?.role ?? user?.attributes?.role ?? user?.roles?.[0] ?? user?.attributes?.type;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;