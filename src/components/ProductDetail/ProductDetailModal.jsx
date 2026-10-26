import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import "./ProductDetailModal.css";

const ProductDetailModal = ({ show, handleClose, product, addToCart }) => {
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    handleClose();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-container product-detail-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="modal-header">
              <h3>{product.name}</h3>
              <button className="modal-close-btn" onClick={handleClose}>
                <FaTimes />
              </button>
            </div>

            {/* Body */}
            <div className="modal-body product-detail-body">
              <motion.div
                className="product-image-wrapper"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-detail-image"
                />
                <div className="product-detail-info">
                  <div className="info-section">
                    <span className="info-label">Price</span>
                    <span className="info-value price">₹{product.price.toFixed(2)}</span>
                  </div>
                  <div className="info-section">
                    <span className="info-label">Availability</span>
                    <span className={`info-value availability ${product.quantity > 0 ? "in-stock" : "out-of-stock"}`}>
                      {product.quantity > 0 ? `${product.quantity} Available` : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="product-description"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h6 className="description-title">Description</h6>
                <p className="description-text">
                  {product.description || "No description available for this product."}
                </p>
              </motion.div>
            </div>

            {/* Footer */}
            <div className="modal-footer product-detail-footer">
              <motion.button
                className="btn btn-outline-danger"
                onClick={handleClose}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{ flex: 1 }}
              >
                <FaTimes /> Close
              </motion.button>
              <motion.button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={product.quantity === 0}
                whileHover={product.quantity > 0 ? { scale: 1.02 } : {}}
                whileTap={product.quantity > 0 ? { scale: 0.98 } : {}}
                style={{ flex: 1 }}
              >
                <FaPlus /> Add to Cart
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
