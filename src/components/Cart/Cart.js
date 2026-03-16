import React from "react";
import { FaTrash } from "react-icons/fa";

const Cart = ({ cart, removeFromCart, clearCart, calculateTotal }) => {
  return (
    <div className="card mt-4">
      <div className="card-header">
        <h2>Cart</h2>
      </div>
      <div className="card-body">
        <ul className="list-group">
          {cart.map((product) => (
            <li
              key={product.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <h5>{product.name}</h5>
                <p>₹{product.price}</p>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(product)}
              >
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <h4>Total: ₹{calculateTotal()}</h4>
          <button className="btn btn-warning btn-sm" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
