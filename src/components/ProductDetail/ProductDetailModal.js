import React from "react";
import { Modal, Button } from "react-bootstrap";

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
        <img
          src={product.image}
          alt={product.name}
          className="img-fluid rounded mb-3"
          style={{ maxHeight: "300px" }}
        />

        <div className="d-flex justify-content-between align-items-center mb-2">
          <small className="text-dark">₹{product.price}</small>
          <small className={product.quantity ? "text-success" : "text-danger"}>
            {product.quantity ? `${product.quantity} left` : "Out of stock"}
          </small>
        </div>

        <p
          className="mb-0 text-start"
          style={{ maxHeight: "6rem", overflow: "auto" }}
        >
          {product.description || "No description available."}
        </p>
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
