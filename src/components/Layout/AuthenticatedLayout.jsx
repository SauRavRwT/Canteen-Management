import { useState, Suspense } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { AnimatePresence, motion } from "framer-motion";
import { auth } from "../../firebase";
import { useAuth } from "../../AuthContext";
import useAdmin from "../../hooks/useAdmin";
import Header from "../Header/Header";
import { PageSkeleton } from "../Skeleton/Skeleton";

const AuthenticatedLayout = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { isAdmin, loading: adminStatusLoading } = useAdmin();
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    try {
      setLogoutError("");
      await signOut(auth);
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
        isAdmin={!adminStatusLoading && isAdmin}
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
        <Suspense fallback={<PageSkeleton label="Loading page" />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
