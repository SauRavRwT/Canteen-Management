import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaBoxOpen,
  FaCog,
  FaSignOutAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import "./Header.css";

const Header = ({
  currentUser,
  isAdmin,
  onLogout,
  onHomeClick,
  onAdminClick,
  onOrdersClick,
}) => {

  return (
    <header className="app-header">
      <div className="header-wrapper">
        {/* Left Spacer */}
        <div className="header-spacer"></div>

        {/* Center Logo */}
        <motion.div
          className="header-logo"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/" className="logo-link" onClick={onHomeClick}>
            <span className="logo-text">🥘 Canteen</span>
          </Link>
        </motion.div>

        {/* Right Navigation */}
        <motion.nav
          className="header-nav"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
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
            <span className="nav-label">My Orders</span>
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

          {currentUser && (
            <div className="user-section">
              <img
                src={`https://ui-avatars.com/api/?name=${currentUser.email}&background=2e7d7d&color=fff`}
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
      </div>
    </header>
  );
};

export default Header;
