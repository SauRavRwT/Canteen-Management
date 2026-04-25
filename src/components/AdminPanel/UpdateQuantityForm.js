import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { ref, update } from "firebase/database";
import { database } from "../../firebase";

const UpdateQuantityForm = ({ products, setProducts }) => {
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
    <Card className="mb-4">
      <Card.Header>Update Product Quantity</Card.Header>
      <Card.Body>
        <Form onSubmit={handleUpdateQuantity}>
          <Form.Group controlId="updateQuantityForm-productSelect">
            <Form.Label>Select Product</Form.Label>
            <Form.Control
              as="select"
              id="select_product"
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
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="updateQuantityForm-quantityInput" className="mt-3">
            <Form.Label>Quantity Change (Increase/Decrease)</Form.Label>
            <Form.Control
              type="number"
              id="quantity_change"
              placeholder="Enter quantity to add (positive) or remove (negative)"
              value={quantityChange}
              onChange={(e) => setQuantityChange(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-4">
            Update Quantity
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UpdateQuantityForm;
