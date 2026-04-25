import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import { motion } from "framer-motion";
import {
  FaShoppingCart,
  FaChartBar,
  FaLock,
  FaBox,
  FaDatabase,
  FaGithub,
  FaStar,
  FaCodeBranch,
  FaFire,
  FaArrowRight,
} from "react-icons/fa";
import "./About.css";
import { useAuth } from "../../AuthContext";

// Shared animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  hover: { y: -10, transition: { duration: 0.3 } },
};

const features = [
  {
    icon: FaShoppingCart,
    title: "Easy Ordering",
    description:
      "Browse menu, add to cart, and checkout in seconds with intuitive interface",
  },
  {
    icon: FaChartBar,
    title: "Admin Analytics",
    description:
      "Real-time dashboard with sales reports and best-seller tracking",
  },
  {
    icon: FaLock,
    title: "Secure Auth",
    description: "Firebase authentication with email verification",
  },
  {
    icon: FaBox,
    title: "Inventory",
    description: "Real-time stock management and product availability",
  },
  {
    icon: FaDatabase,
    title: "Data Sync",
    description: "Instant data synchronization across all devices",
  },
  {
    icon: FaFire,
    title: "Live Updates",
    description: "Real-time notifications and order tracking",
  },
];

const workflowSteps = [
  {
    step: 1,
    title: "User Authentication",
    description: "Users sign up/login with Firebase Auth",
  },
  {
    step: 2,
    title: "Browse Products",
    description: "Real-time product list fetched from Firestore Database",
  },
  {
    step: 3,
    title: "Add to Cart",
    description: "Items stored in browser localStorage for persistence",
  },
  {
    step: 4,
    title: "Checkout",
    description:
      "Orders saved to Firebase and product quantities updated in DB",
  },
  {
    step: 5,
    title: "Receipt Generation",
    description: "PDF receipt created using jsPDF library",
  },
  {
    step: 6,
    title: "Admin Dashboard",
    description: "Admins can track orders, manage inventory, and view stats",
  },
];

const firebaseFeatures = [
  {
    icon: FaLock,
    title: "Authentication",
    description:
      "Email/password authentication with secure user session management",
  },
  {
    icon: FaDatabase,
    title: "Real-time Database",
    description:
      "Firebase Realtime Database for storing products, orders, and sales data",
  },
  {
    icon: FaArrowRight,
    title: "Data Synchronization",
    description:
      "All clients stay in sync with live database updates without polling",
  },
  {
    icon: FaFire,
    title: "Cloud Functions",
    description: "Backend logic handled through Firebase Functions",
  },
];

const About = () => {
  const navigate = useNavigate();
  const { currentUser, isAdmin, logout } = useAuth();
  const [githubData, setGithubData] = useState({ stars: 0, forks: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/repos/SauRavRwT/Canteen-Management",
        );
        const data = await response.json();
        setGithubData({
          stars: data.stargazers_count || 0,
          forks: data.forks_count || 0,
        });
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGithubData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Shared viewport props to avoid repetition
  const inView = { once: true, margin: "-100px" };

  return (
    <div className="about-container">
      <Header
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onHomeClick={() => navigate("/")}
        onAdminClick={() => navigate("/admin")}
        onOrdersClick={() => navigate("/orders")}
      />

      {/* Hero */}
      <motion.div
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="hero-title">
            👋🏻 Hi, I'm Saurav Rawat,
          </motion.h1>
          <motion.p variants={itemVariants} className="hero-subtitle">
             A passionate web developer and data enthusiast. Welcome to the Canteen Management System!
          </motion.p>
          <motion.button
            variants={itemVariants}
            className="cta-button"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaShoppingCart className="me-2" /> Start Ordering
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Overview */}
      <motion.section
        className="section-overview"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <motion.div variants={itemVariants} className="section-header">
          <h2>Project Overview</h2>
          <p>
            The Canteen Management System is a comprehensive full-stack
            application built with React, Firebase, and modern web technologies.
            It revolutionizes how canteens in educational institutions and
            corporate offices manage orders, inventory, and customer
            interactions.
          </p>
        </motion.div>

        <motion.div
          className="features-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="feature-card"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="feature-icon">
                  <Icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.section>

      {/* Workflow */}
      <motion.section
        className="section-workflow"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <motion.div variants={itemVariants} className="section-header">
          <h2>How It Works</h2>
        </motion.div>
        <div className="workflow-timeline">
          {workflowSteps.map((item) => (
            <motion.div
              key={item.step}
              className="workflow-item"
              variants={itemVariants}
            >
              <div className="step-number">{item.step}</div>
              <div className="step-content">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Firebase */}
      <motion.section
        className="section-firebase"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <motion.div variants={itemVariants} className="section-header">
          <h2>Firebase Integration</h2>
        </motion.div>

        <motion.div
          className="firebase-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
        >
          {firebaseFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                className="firebase-card"
                variants={cardVariants}
                whileHover="hover"
              >
                <div className="firebase-icon-box">
                  <Icon />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          className="firebase-details"
          variants={itemVariants}
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3>Key Firebase Services Used:</h3>
          <ul>
            <li>
              <strong>Authentication:</strong> Secure user login and signup with
              Firebase Auth
            </li>
            <li>
              <strong>Realtime Database:</strong> Products, orders, and sales
              data synced in real-time
            </li>
            <li>
              <strong>Data Persistence:</strong> All orders and user actions are
              saved instantly
            </li>
            <li>
              <strong>Cloud Functions:</strong> Backend operations for order
              processing
            </li>
          </ul>
        </motion.div>
      </motion.section>

      {/* GitHub Stats */}
      <motion.section
        className="section-github"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <motion.div variants={itemVariants} className="section-header">
          <h2>
            <FaGithub className="github-icon" /> Stars &amp; Forks
          </h2>
        </motion.div>

        <motion.div
          className="github-stats"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={inView}
        >
          {[
            {
              type: "stars",
              icon: FaStar,
              label: "Stars",
              count: githubData.stars,
            },
            {
              type: "forks",
              icon: FaCodeBranch,
              label: "Forks",
              count: githubData.forks,
            },
          ].map(({ type, icon: Icon, label, count }) => (
            <motion.div
              className={`stat-card ${type}`}
              variants={cardVariants}
              whileHover="hover"
              key={type}
            >
              <motion.div
                className="stat-icon"
                whileHover={{ rotate: 360, scale: 1.2 }}
              >
                <Icon />
              </motion.div>
              <div className="stat-info">
                <h4>{label}</h4>
                <p className="stat-number">{loading ? "..." : count}</p>
                <span className="stat-label">GitHub {label}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.a
          href="https://github.com/SauRavRwT/Canteen-Management"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link-btn"
          variants={itemVariants}
          whileInView="visible"
          viewport={{ once: true }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaGithub /> View on GitHub
        </motion.a>
      </motion.section>

      {/* CTA */}
      <motion.section
        className="section-cta"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <motion.div className="cta-content" variants={itemVariants}>
          <h2>Ready to Make an Impact?</h2>
          <p>
            Start contributing to the Canteen Management System today and be
            part of our growing community!
          </p>
          <motion.div className="cta-buttons" variants={containerVariants}>
            <motion.a
              href="https://github.com/SauRavRwT/Canteen-Management"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaGithub /> Contribute Now
            </motion.a>
            <motion.button
              className="btn-secondary"
              variants={itemVariants}
              onClick={() => navigate("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaShoppingCart /> Back to Home
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default About;
