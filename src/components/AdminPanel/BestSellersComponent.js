import React from "react";
import { motion } from "framer-motion";
import { FaTrophy, FaFire } from "react-icons/fa";
import "./BestSellersComponent.css";

const BestSellersComponent = ({ bestSellers }) => {
  const maxQuantity = bestSellers.length > 0 ? Math.max(...bestSellers.map(p => p.quantity)) : 1;
  const medalsColor = ["gold", "silver", "bronze"];

  return (
    <motion.div
      className="best-sellers-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="sellers-header">
        <div className="header-left">
          <FaTrophy className="header-icon" />
          <h4 className="sellers-title">Top Selling Products</h4>
        </div>
        <FaFire className="fire-icon" />
      </div>

      <div className="sellers-content">
        {bestSellers.length > 0 ? (
          <div className="sellers-list">
            {bestSellers.map((product, index) => {
              const percentage = (product.quantity / maxQuantity) * 100;
              const medalColor = medalsColor[index] || "text-secondary";

              return (
                <motion.div
                  key={index}
                  className="seller-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="seller-rank">
                    <span className={`rank-badge ${medalColor}`}>
                      {index + 1}
                    </span>
                  </div>

                  <div className="seller-info">
                    <h6 className="seller-name">{product.name}</h6>
                    <div className="seller-bar">
                      <motion.div
                        className="seller-bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      />
                    </div>
                  </div>

                  <div className="seller-quantity">
                    <span className="quantity-value">{product.quantity}</span>
                    <span className="quantity-label">sold</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="no-data-message">
            <p>No sales data available yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BestSellersComponent;
