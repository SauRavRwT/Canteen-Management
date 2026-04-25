import React from "react";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      className="app-footer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="footer-bottom">
        <div className="copyright">
          &copy; {currentYear} Canteen Management System. All rights reserved.
        </div>
        <div className="footer-credits">
          Made with <FaHeart className="heart-icon" /> by
          <a
            href="https://github.com/SauRavRwT"
            target="_blank"
            rel="noopener noreferrer"
            className="developer-link"
          >
            Saurav Rawat
          </a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
