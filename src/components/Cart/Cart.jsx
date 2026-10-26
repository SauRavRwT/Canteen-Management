import { FaTrash } from "react-opacity-icon/fa";
import { FaTrash as FaTrashIcon } from "react-icons/fa";

const Cart = ({ cart, removeFromCart, clearCart, calculateTotal }) => {
  return (
    <div className="solid-card p-4" style={{ marginTop: "1rem" }}>
      <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border-color)", marginBottom: "1rem" }}>
        <h3 style={{ margin: 0 }}>Cart</h3>
      </div>
      <div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {cart.map((product) => (
            <li
              key={product.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0.75rem 1rem",
                background: "var(--bg-inset)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-color)"
              }}
            >
              <div>
                <h5 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 600 }}>{product.name}</h5>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--primary)" }}>₹{product.price}</p>
              </div>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(product)}
                aria-label="Remove item"
              >
                <FaTrashIcon />
              </button>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <h4 style={{ margin: 0, fontSize: "1.1rem" }}>Total: <span style={{ color: "var(--primary)", fontWeight: 700 }}>₹{calculateTotal()}</span></h4>
          <button className="btn btn-secondary btn-sm" onClick={clearCart}>
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
