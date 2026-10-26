import { useState } from "react";
import { ref, push } from "firebase/database";
import { database } from "../../firebase";

const AddProductForm = () => {
  const [initialPrices, setInitialPrices] = useState("");
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState("");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        name: productName,
        initialPrices: parseFloat(initialPrices),
        price: parseFloat(productPrice),
        description: productDescription,
        image: productImage,
        quantity: 0,
      };

      const productsRef = ref(database, "products");
      await push(productsRef, newProduct);

      // Reset the form
      setProductName("");
      setInitialPrices("");
      setProductPrice("");
      setProductDescription("");
      setProductImage("");

      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    }
  };

  return (
    <div className="glass-card">
      <div style={{ padding: "1.15rem 1.5rem", borderBottom: "1px solid var(--border-color)" }}>
        <h4 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Add New Product</h4>
      </div>
      <div style={{ padding: "1.5rem" }}>
        <form onSubmit={handleAddProduct} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="form-group">
            <label className="form-label" htmlFor="addProduct-name">Product Name</label>
            <input
              className="form-control"
              id="addProduct-name"
              type="text"
              name="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="addProduct-initialPrice">Initial Product Price (₹)</label>
            <input
              className="form-control"
              id="addProduct-initialPrice"
              type="number"
              name="initialPrice"
              step="0.1"
              min="0"
              placeholder="Enter initial product price"
              value={initialPrices}
              onChange={(e) => setInitialPrices(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="addProduct-currentPrice">Product Price (₹)</label>
            <input
              className="form-control"
              id="addProduct-currentPrice"
              type="number"
              name="currentPrice"
              step="0.1"
              min="0"
              placeholder="Enter product price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="addProduct-description">Product Description</label>
            <textarea
              className="form-control"
              id="addProduct-description"
              name="description"
              rows={3}
              placeholder="Enter product description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="addProduct-image">Product Image URL</label>
            <input
              className="form-control"
              id="addProduct-image"
              type="url"
              name="imageUrl"
              placeholder="Enter product image URL"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
