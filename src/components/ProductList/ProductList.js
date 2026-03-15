import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import "./ProductList.css";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const ProductList = ({ products, addToCart, onProductClick }) => {
  return (
    <motion.div 
      className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 hover"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {products.map((product) => (
        <motion.div 
          key={product.id} 
          className="col"
          variants={itemVariants}
          whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="card h-100 rounded-4 shadow-sm">
            <img
              src={product.image}
              className="card-img-top rounded-top-4 product-image"
              alt={product.name}
            />
            <div className="card-body d-flex flex-column">
              <h5 className="card-title fw-bold">{product.name}</h5>
              <p className="card-text">
                <strong>Price:</strong> ₹{product.price}
              </p>
              <p className="card-text">
                <strong>Quantity:</strong> {product.quantity}
              </p>
              <div className="mt-auto">
                <div className="d-flex flex-row align-items-center gap-2">
                  <button
                    className="btn btn-outline-secondary rounded-3 w-100"
                    onClick={() => onProductClick(product)}
                  >
                    View details
                  </button>
                  <button
                    className="btn btn-primary rounded-3 w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    disabled={product.quantity === 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ProductList;
