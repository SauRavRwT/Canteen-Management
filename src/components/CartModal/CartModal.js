import React from "react";
import { Modal, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion";
import "./CartModal.css";
import { FaMinus, FaPlus, FaTrash, FaShoppingCart } from "react-icons/fa";

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
  const subtotal = calculateTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  return (
    <Modal show={show} onHide={handleClose} centered className="cart-modal">
      <Modal.Header closeButton className="cart-modal-header">
        <Modal.Title className="cart-modal-title">
          <FaShoppingCart className="me-2" />
          Your Cart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="cart-modal-body">
        {cart.length === 0 ? (
          <motion.div
            className="empty-cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaShoppingCart className="empty-cart-icon" />
            <h4>Your cart is empty</h4>
            <p>Add items from the menu to get started</p>
          </motion.div>
        ) : (
          <motion.div className="cart-items">
            <AnimatePresence mode="popLayout">
              {cart.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="cart-item"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  layout
                >
                  <img
                    className="cart-item-image"
                    src={product.image}
                    alt={product.name}
                  />
                  <div className="cart-item-info">
                    <h6 className="cart-item-name">{product.name}</h6>
                    <p className="cart-item-price">₹{product.price.toFixed(2)}</p>
                  </div>
                  <div className="cart-item-controls">
                    <motion.button
                      className="qty-btn"
                      onClick={() => decrementQuantity(product.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaMinus />
                    </motion.button>
                    <span className="qty-display">{product.quantity}</span>
                    <motion.button
                      className="qty-btn"
                      onClick={() => incrementQuantity(product.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaPlus />
                    </motion.button>
                    <motion.button
                      className="remove-btn"
                      onClick={() => removeFromCart(product)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FaTrash />
                    </motion.button>
                  </div>
                  <div className="cart-item-total">
                    ₹{(product.price * product.quantity).toFixed(2)}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Modal.Body>
      {cart.length > 0 && (
        <Modal.Footer className="cart-modal-footer">
          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <div className="cart-actions">
            <Button
              className="btn-clear"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
            <Button
              className="btn-checkout"
              onClick={checkout}
            >
              Checkout
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CartModal;
