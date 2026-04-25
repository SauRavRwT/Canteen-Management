import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import "./ProductList.css";
import { FaPlus, FaEye } from "react-icons/fa";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  }
};

const ProductList = ({ products, addToCart, onProductClick }) => {
  // Validate and sanitize products
  const validProducts = (products || []).map(product => ({
    ...product,
    price: product.price ?? 0,
    quantity: product.quantity ?? 0,
    name: product.name ?? 'Unknown Product',
    image: product.image ?? 'https://via.placeholder.com/300',
  }));
  return (
    <motion.div 
      className="products-grid"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {validProducts.map((product) => (
        <motion.div 
          key={product.id} 
          className="product-card-wrapper"
          variants={itemVariants}
          whileHover={{ y: -8 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="product-card">
            <div className="product-image-container">
              <img
                src={product.image}
                className="product-image"
                alt={product.name}
              />
              <div className="product-overlay">
                <motion.button
                  className="overlay-btn view-btn"
                  onClick={() => onProductClick(product)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaEye /> View Details
                </motion.button>
              </div>
              {product.quantity === 0 && (
                <div className="stock-badge out-of-stock">Out of Stock</div>
              )}
              {product.quantity > 0 && product.quantity <= 3 && (
                <div className="stock-badge low-stock">Low Stock</div>
              )}
            </div>
            
            <div className="product-body">
              <h5 className="product-name">{product.name}</h5>
              
              <div className="product-price">₹{(Number(product.price) || 0).toFixed(2)}</div>
              
              <div className="product-quantity">
                <span className="qty-label">Available:</span>
                <span className="qty-value">{Number(product.quantity) || 0}</span>
              </div>
              
              <motion.button
                className="product-add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={product.quantity === 0}
                whileHover={product.quantity > 0 ? { scale: 1.05 } : {}}
                whileTap={product.quantity > 0 ? { scale: 0.95 } : {}}
              >
                <FaPlus /> Add to Cart
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductList;
