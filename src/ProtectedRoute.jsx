import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  HomePageSkeleton,
  PageSkeleton,
} from "./components/Skeleton/Skeleton";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    if (location.pathname === "/") return <HomePageSkeleton />;
    if (location.pathname === "/orders") return <PageSkeleton label="Loading orders" />;
    return <PageSkeleton label="Verifying your session" />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
