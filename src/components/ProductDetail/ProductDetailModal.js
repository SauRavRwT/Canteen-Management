import React from "react";
import { Modal, Button } from "react-bootstrap";
import { motion } from "framer-motion";

const ProductDetailModal = ({ show, handleClose, product, addToCart }) => {
  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title className="fw-bold fs-2">{product.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-center">
        <motion.img
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          src={product.image}
          alt={product.name}
          className="img-fluid rounded mb-3"
          style={{ maxHeight: "300px" }}
        />

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="d-flex justify-content-between align-items-center mb-2"
        >
          <small className="text-dark">₹{product.price}</small>
          <small className={product.quantity ? "text-success" : "text-danger"}>
            {product.quantity ? `${product.quantity} left` : "Out of stock"}
          </small>
        </motion.div>

        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-0 text-start"
          style={{ maxHeight: "6rem", overflow: "auto" }}
        >
          {product.description || "No description available."}
        </motion.p>
      </Modal.Body>

      <Modal.Footer>
        <Button className="rounded-4" variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          className="rounded-4"
          variant="primary"
          onClick={handleAddToCart}
          disabled={product.quantity === 0}
        >
          Add to Cart
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetailModal;
