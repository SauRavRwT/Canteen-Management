import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaCog,
  FaSignOutAlt,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import "./Header.css";

const Header = ({
  currentUser,
  isAdmin,
  onLogout,
  onHomeClick,
  onAdminClick,
  onOrdersClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobile = () => setMobileMenuOpen(false);

  return (
    <header className="app-header">
      <div className="header-wrapper">
        {/* Logo */}
        <motion.div
          className="header-logo"
          initial={false}
          animate={{ scale: 1, opacity: 1 }}
        >
          <Link to="/" className="logo-link" onClick={onHomeClick}>
            <span className="logo-text">🥘 Canteen</span>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <motion.nav
          className="header-nav"
          initial={false}
          animate={{ x: 0, opacity: 1 }}
        >
          <motion.button
            className="nav-btn"
            onClick={onHomeClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaHome className="nav-icon" />
            <span className="nav-label">Home</span>
          </motion.button>

          <motion.button
            className="nav-btn"
            onClick={onOrdersClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaBoxOpen className="nav-icon" />
            <span className="nav-label">Orders</span>
          </motion.button>

          <Link to="/about" style={{ textDecoration: "none" }}>
            <motion.button
              className="nav-btn"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaInfoCircle className="nav-icon" />
              <span className="nav-label">About</span>
            </motion.button>
          </Link>

          {isAdmin && (
            <motion.button
              className="nav-btn"
              onClick={onAdminClick}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaCog className="nav-icon" />
              <span className="nav-label">Admin</span>
            </motion.button>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Section */}
          {currentUser && (
            <div className="user-section">
              <img
                src={`https://ui-avatars.com/api/?name=${currentUser.email}&background=E23744&color=fff`}
                alt="profile"
                className="user-avatar"
              />
              <motion.button
                className="logout-btn"
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Logout"
              >
                <FaSignOutAlt className="logout-icon" />
                <span className="logout-label">Logout</span>
              </motion.button>
            </div>
          )}
        </motion.nav>

        {/* Mobile Menu Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button
              className="mobile-nav-btn"
              onClick={() => {
                onHomeClick();
                closeMobile();
              }}
            >
              <FaHome /> Home
            </button>
            <button
              className="mobile-nav-btn"
              onClick={() => {
                onOrdersClick();
                closeMobile();
              }}
            >
              <FaBoxOpen /> Orders
            </button>
            <Link to="/about" className="mobile-nav-btn" onClick={closeMobile}>
              <FaInfoCircle /> About
            </Link>
            {isAdmin && (
              <button
                className="mobile-nav-btn"
                onClick={() => {
                  onAdminClick();
                  closeMobile();
                }}
              >
                <FaCog /> Admin
              </button>
            )}
            <ThemeToggle className="mobile-nav-btn theme-toggle-btn" showLabel />
            {currentUser && (
              <button
                className="mobile-nav-btn mobile-logout"
                onClick={() => {
                  onLogout();
                  closeMobile();
                }}
              >
                <FaSignOutAlt /> Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
