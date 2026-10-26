import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaChartBar, FaBox, FaGithub } from "react-icons/fa";
import "./About.css";
import { useAuth } from "../../AuthContext";
import Footer from "../Footer/Footer";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const features = [
  {
    icon: FaShoppingCart,
    title: "Simple ordering",
    description: "Browse available items and place an order from one menu.",
  },
  {
    icon: FaBox,
    title: "Inventory management",
    description: "Keep product availability and stock quantities up to date.",
  },
  {
    icon: FaChartBar,
    title: "Order administration",
    description:
      "Give administrators a central place to review orders and sales.",
  },
];

const workflowSteps = [
  {
    step: 1,
    title: "Browse the menu",
    description: "Sign in and choose from the available canteen items.",
  },
  {
    step: 2,
    title: "Place an order",
    description: "Add items to your cart and submit your order.",
  },
  {
    step: 3,
    title: "Manage operations",
    description: "Administrators can review orders and update the menu.",
  },
];

const About = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, [currentUser, navigate]);

  const inView = { once: true, margin: "-100px" };

  return (
    <div className="about-container">
      {/* Hero */}
      <motion.div
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="hero-title">
            About the Canteen Management System
          </motion.h1>
          <motion.p variants={itemVariants} className="hero-subtitle">
            A platform for browsing the menu, placing orders, and managing
            canteen operations.
          </motion.p>
          <motion.button
            variants={itemVariants}
            className="cta-button"
            onClick={() => navigate("/")}
          >
            <FaShoppingCart /> Start ordering
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
          <h2>What you can do</h2>
          <p>
            Customers can order from the current menu, while administrators can
            manage products, stock, and incoming orders.
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
          <h2>How it works</h2>
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

      <motion.section
        className="section-project-link"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={inView}
      >
        <motion.a
          href="https://github.com/SauRavRwT/Canteen-Management"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link-btn"
          variants={itemVariants}
        >
          <FaGithub /> View on GitHub
        </motion.a>
      </motion.section>
      <Footer />
    </div>
  );
};

export default About;
