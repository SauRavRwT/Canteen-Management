import { motion } from "framer-motion";
import { FaDesktop, FaMoon, FaSun } from "react-icons/fa";
import { useTheme } from "../../ThemeContext";
import "./ThemeToggle.css";

const ThemeToggle = ({ className = "theme-toggle-btn", showLabel = false }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const icon = theme === "system" ? <FaDesktop /> : isDark ? <FaMoon /> : <FaSun />;
  const label = theme === "system" ? "Auto" : isDark ? "Dark" : "Light";

  return (
    <motion.button
      type="button"
      className={className}
      onClick={toggleTheme}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Theme: ${label}`}
      aria-label={`Switch theme, currently ${label}`}
    >
      <span className="theme-icon" aria-hidden="true">{icon}</span>
      {showLabel && <span>Theme: {label}</span>}
    </motion.button>
  );
};

export default ThemeToggle;
