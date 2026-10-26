import { useState } from "react";
import { ref, update } from "firebase/database";
import { database } from "../../firebase";

const UpdateQuantityForm = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantityChange, setQuantityChange] = useState("");

  const handleUpdateQuantity = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !quantityChange) return;

    try {
      const productRef = ref(database, `products/${selectedProduct}`);
      const currentQuantity = products[selectedProduct]?.quantity || 0;
      const newQuantity = currentQuantity + parseInt(quantityChange);

      if (newQuantity < 0) {
        alert("Quantity cannot be negative!");
        return;
      }

      // Update product's quantity in Firebase
      await update(productRef, {
        quantity: newQuantity,
      });

      // Reset the form
      setSelectedProduct("");
      setQuantityChange("");

      alert("Quantity updated successfully!");
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update quantity. Please try again.");
    }
  };

  return (
    <div className="glass-card">
      <div style={{ padding: "1.15rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>
          Update Product Quantity
        </h4>
      </div>
      <div style={{ padding: "1.5rem" }}>
        <form onSubmit={handleUpdateQuantity} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="updateQuantityForm-productSelect">
              Select Product
            </label>
            <select
              className="form-select"
              id="updateQuantityForm-productSelect"
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              required
            >
              <option value="">Select a product...</option>
              {Object.entries(products).map(([id, product]) => (
                <option key={id} value={id}>
                  {product.name} (Current Quantity: {product.quantity || 0})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="updateQuantityForm-quantityInput">
              Quantity Change (Increase/Decrease)
            </label>
            <input
              className="form-control"
              id="updateQuantityForm-quantityInput"
              type="number"
              placeholder="Enter quantity to add (positive) or remove (negative)"
              value={quantityChange}
              onChange={(e) => setQuantityChange(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            Update Quantity
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuantityForm;
