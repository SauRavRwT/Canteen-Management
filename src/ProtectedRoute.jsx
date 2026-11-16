import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Header from "./components/Header/Header";
import { RouteSkeleton } from "./components/Skeleton/Skeleton";
import { readAdminHint } from "./hooks/useAdmin";

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    // Same shell as AuthenticatedLayout (real header, same page frame), so
    // when the session resolves only the placeholders change, not the layout.
    return (
      <div className="app-shell" role="status" aria-label="Verifying your session">
        <Header
          loading
          isAdmin={readAdminHint()}
          onHomeClick={() => navigate("/")}
          onOrdersClick={() => navigate("/orders")}
          onAdminClick={() => navigate("/", { state: { showAdmin: true } })}
          onLogout={() => {}}
        />
        <div className="app-shell-content">
          <RouteSkeleton
            pathname={location.pathname}
            showAdmin={location.state?.showAdmin === true}
          />
        </div>
      </div>
    );
  }

  if (!currentUser || !currentUser.emailVerified) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
