import React from "react";
import { Modal } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaPlus, FaTimes } from "react-icons/fa";
import "./ProductDetailModal.css";

const ProductDetailModal = ({ show, handleClose, product, addToCart }) => {
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="product-detail-modal">
      <Modal.Header className="product-detail-header">
        <Modal.Title className="product-detail-title">{product.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="product-detail-body">
        <motion.div
          className="product-image-wrapper"
          initial={{ scale: 0.9, opacity: 0 }}
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
      </Modal.Body>

      <Modal.Footer className="product-detail-footer">
        <motion.button
          className="btn-close-detail"
          onClick={handleClose}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaTimes /> Close
        </motion.button>
        <motion.button
          className="btn-add-detail"
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
          whileHover={product.quantity > 0 ? { scale: 1.05 } : {}}
          whileTap={product.quantity > 0 ? { scale: 0.95 } : {}}
        >
          <FaPlus /> Add to Cart
        </motion.button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailModal;
