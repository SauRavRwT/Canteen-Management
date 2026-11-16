import { useState, useEffect, Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { auth } from "../../firebase";
import { useAuth } from "../../AuthContext";
import useAdmin, { clearAdminHint } from "../../hooks/useAdmin";
import Header from "../Header/Header";
import { RouteSkeleton } from "../Skeleton/Skeleton";
import { loadAbout, loadAdminPanel, preloadWhenIdle } from "../../lazyPages";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const location = useLocation();
  const { showAdminLink } = useAdmin();
  const [logoutError, setLogoutError] = useState("");

  // Warm up lazy page chunks once the current page is idle, so navigating to
  // them rarely has to show a fallback at all.
  useEffect(
    () => preloadWhenIdle(...(showAdminLink ? [loadAbout, loadAdminPanel] : [loadAbout])),
    [showAdminLink],
  );

  const handleLogout = async () => {
    try {
      setLogoutError("");
      await signOut(auth);
      clearAdminHint();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setLogoutError("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="app-shell">
      <Header
        currentUser={currentUser}
        isAdmin={showAdminLink}
        onLogout={handleLogout}
        onHomeClick={() => navigate("/")}
        onAdminClick={() => navigate("/", { state: { showAdmin: true } })}
        onOrdersClick={() => navigate("/orders")}
      />
      <AnimatePresence>
        {logoutError && (
          <motion.div
            className="toast toast-danger"
            style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1100 }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            role="alert"
          >
            {logoutError}
            <button className="toast-close" onClick={() => setLogoutError("")}>×</button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="app-shell-content">
        <Suspense
          fallback={
            <RouteSkeleton
              pathname={location.pathname}
              showAdmin={location.state?.showAdmin === true}
            />
          }
        >
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
