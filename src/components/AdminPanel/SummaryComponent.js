import React from "react";
import { motion } from "framer-motion";
import "./SummaryComponent.css";

const SummaryComponent = ({ data, title }) => {
  const totalProfit = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div
      className="summary-card"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="summary-header">
        <h5 className="summary-title">{title} Summary</h5>
        <div className="summary-total">
          <span className="total-label">Total Profit</span>
          <span className="total-value">₹{totalProfit.toFixed(2)}</span>
        </div>
      </div>

      <div className="summary-table-container">
        {data.length > 0 ? (
          <table className="summary-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Profit</th>
                <th>Share</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const percent = totalProfit ? (item.value / totalProfit) * 100 : 0;
                return (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: "rgba(46, 125, 125, 0.05)" }}
                  >
                    <td className="product-col">{item.name}</td>
                    <td className="profit-col">₹{item.value.toFixed(2)}</td>
                    <td className="percentage-col">
                      <div className="progress-bar-container">
                        <div className="progress-label">{percent.toFixed(1)}%</div>
                        <div className="progress-bar">
                          <motion.div
                            className="progress-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${percent}%` }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                          />
                        </div>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="no-data-message">
            <p>No data available</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SummaryComponent;
