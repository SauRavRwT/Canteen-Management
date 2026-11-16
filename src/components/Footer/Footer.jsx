import { FaHeart } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
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
    </footer>
  );
};

export default Footer;
