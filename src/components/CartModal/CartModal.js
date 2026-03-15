import React from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";
import "./CartModal.css";

const CartModal = ({
  show,
  handleClose,
  cart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
  calculateTotal,
  checkout,
}) => {
  return (
    <Modal show={show} onHide={handleClose} centered className="rounded-4">
      <Modal.Header closeButton className="border-bottom-0">
        <Modal.Title className="fw-bold p-3">Cart</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <AnimatePresence>
            {cart.map((product) => (
              <motion.div
                key={product.id}
                className="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <div className="d-flex align-items-center">
                  <img
                    className="img-fluid rounded-4 me-3"
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <h5 className="mb-0">{product.name}</h5>
                    <p className="mb-0">₹{product.price}</p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <button
                    className="btn btn-sm btn-outline-secondary mx-1 rounded-4"
                    onClick={() => decrementQuantity(product.id)}
                  >
                    -
                  </button>
                  <span className="mx-2">{product.quantity}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary mx-1 rounded-4"
                    onClick={() => incrementQuantity(product.id)}
                  >
                    +
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger mx-1 rounded-4"
                    onClick={() => removeFromCart(product)}
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </Modal.Body>
      <Modal.Footer className="border-top-0">
        <h4 className="monospace fw-bold me-auto">
          Total: ₹{calculateTotal()}
        </h4>
        <Button
          variant="outline-danger"
          className="rounded-4"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
        <Button variant="success" className="rounded-4" onClick={checkout}>
          Checkout
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CartModal;
