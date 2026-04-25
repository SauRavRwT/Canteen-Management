import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
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
    <Card className="mb-4">
      <Card.Header>Add New Product</Card.Header>
      <Card.Body>
        <Form onSubmit={handleAddProduct}>
          <Form.Group controlId="addProduct-name">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              id="product_name"
              name="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="addProduct-initialPrice" className="mt-3">
            <Form.Label>Initial Product Price (₹)</Form.Label>
            <Form.Control
              type="number"
              name="initialPrice"
              id="initial_price"
              step="0.1"
              min="0"
              placeholder="Enter initial product price"
              value={initialPrices}
              onChange={(e) => setInitialPrices(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="addProduct-currentPrice" className="mt-3">
            <Form.Label>Product Price (₹)</Form.Label>
            <Form.Control
              type="number"
              name="currentPrice"
              step="0.1"
              min="0"
              id="product_price"
              placeholder="Enter product price"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="addProduct-description" className="mt-3">
            <Form.Label>Product Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              id="product_description"
              rows={3}
              placeholder="Enter product description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group controlId="addProduct-image" className="mt-3">
            <Form.Label>Product Image URL</Form.Label>
            <Form.Control
              type="url"
              name="imageUrl"
              id="product_image"
              placeholder="Enter product image URL"
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="mt-4">
            Add Product
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddProductForm;
