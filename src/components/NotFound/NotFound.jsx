import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "../../AuthContext";
import useAdmin from "../../hooks/useAdmin";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { motion } from "framer-motion";
import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isAdmin = useAdmin();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      navigate("/");
    }
  };

  const handleOrdersClick = () => {
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Header
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onHomeClick={handleHomeClick}
        onAdminClick={handleAdminClick}
        onOrdersClick={handleOrdersClick}
      />
      <div className="not-found-container">
        <div className="not-found-content">
          <h1 className="error-code">404</h1>
          <h2 className="error-title">Page Not Found</h2>
          <p className="error-message">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <div className="error-actions">
            <button onClick={handleHomeClick} className="btn btn-primary">
              Go Back to Home
            </button>
            <button onClick={() => navigate("/about")} className="btn btn-secondary">
              Visit About
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default NotFound;
