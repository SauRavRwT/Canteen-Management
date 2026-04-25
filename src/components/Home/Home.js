import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import ProductList from "../ProductList/ProductList";
import CartModal from "../CartModal/CartModal";
import ProductDetailModal from "../ProductDetail/ProductDetailModal";
import Footer from "../Footer/Footer";
import AdminPanel from "../AdminPanel/AdminPanel";
import UserOrderHistory from "./UserOrderHistory";
import Header from "../Header/Header";
import useProducts from "../../hooks/useProducts";
import { auth } from "../../firebase";
import { signOut } from "firebase/auth";
import { Toast, Form, InputGroup, Container } from "react-bootstrap";
import { useAuth } from "../../AuthContext";
import useAdmin from "../../hooks/useAdmin";
import { motion } from "framer-motion";
import { useCart } from "../../hooks/useCart";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { products, updateProductQuantity } = useProducts();
  const [originalQuantities, setOriginalQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const isAdmin = useAdmin();

  // Use cart hook for all cart operations
  const {
    cart,
    showCartModal,
    setShowCartModal,
    showCheckoutToast,
    setShowCheckoutToast,
    addToCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
    calculateTotal,
    checkout,
  } = useCart(originalQuantities, currentUser, updateProductQuantity);

  useEffect(() => {
    if (products && products.length > 0) {
      const updatedQuantities = products.reduce((acc, product) => {
        acc[product.id] = product.quantity;
        return acc;
      }, {});

      setOriginalQuantities(updatedQuantities);
    }
  }, [products]);

  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (!currentUser) {
      setShowAdmin(false);
    }
  }, [currentUser]);

  const filteredProducts = products
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetailModal(true);
  };

  const handleLogout = async () => {
    try {
      setLogoutError("");
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setLogoutError("Failed to log out. Please try again.");
    }
  };

  const handleAdminClick = () => {
    if (isAdmin) {
      setShowAdmin(true);
      setShowOrderHistory(false);
    }
  };

  const handleHomeClick = () => {
    setShowAdmin(false);
    setShowOrderHistory(false);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header
        currentUser={currentUser}
        isAdmin={isAdmin}
        onLogout={handleLogout}
        onHomeClick={handleHomeClick}
        onAdminClick={handleAdminClick}
        onOrdersClick={() => {
          setShowOrderHistory(true);
          setShowAdmin(false);
        }}
      />

      <Container className="mt-5 flex-grow-1">
        {logoutError && (
          <Toast
            show={!!logoutError}
            onClose={() => setLogoutError("")}
            className="position-fixed top-0 end-0 m-3"
            bg="danger"
            text="white"
          >
            <Toast.Body>{logoutError}</Toast.Body>
          </Toast>
        )}

        {showAdmin ? (
          <AdminPanel />
        ) : showOrderHistory ? (
          <UserOrderHistory />
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4 row">
              <h1 className="fw-bold col">Today's items</h1>
              <Form.Group className="w-100 w-md-50 my-auto col">
                <Form.Label htmlFor="searchInput" visuallyHidden>
                  Search Products
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text id="searchIcon">
                    <i className="fas fa-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    id="searchInput"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </div>
            {cart.length > 0 && (
              <button
                className="btn btn-primary rounded-4 fw-bold"
                onClick={() => setShowCartModal(true)}
              >
                <i className="fas fa-shopping-cart me-2"></i>
                View Cart ({cart.length})
              </button>
            )}
            {filteredProducts.length > 0 ? (
              <ProductList
                products={filteredProducts.map((p) => ({
                  ...p,
                  quantity:
                    originalQuantities[p.id] -
                    (cart.find((cp) => cp.id === p.id)?.quantity || 0),
                }))}
                addToCart={addToCart}
                onProductClick={handleProductClick}
              />
            ) : (
              <div className="text-center mt-5">
                <h3>Sorry, we're currently not serving any items.</h3>
                <p className="text-muted">
                  Please check back later or contact{" "}
                  <a
                    className="text-decoration-none"
                    href="https://github.com/SauRavRwT/"
                  >
                    maintainer
                  </a>
                  !
                </p>
              </div>
            )}
            <CartModal
              show={showCartModal}
              handleClose={() => setShowCartModal(false)}
              cart={cart}
              incrementQuantity={incrementQuantity}
              decrementQuantity={decrementQuantity}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              calculateTotal={calculateTotal}
              checkout={checkout}
            />
            <ProductDetailModal
              show={showProductDetailModal}
              handleClose={() => setShowProductDetailModal(false)}
              product={selectedProduct}
              addToCart={addToCart}
            />
            <Toast
              show={showCheckoutToast}
              onClose={() => setShowCheckoutToast(false)}
              className="position-fixed bottom-0 end-0 m-3"
              delay={3000}
              autohide
            >
              <Toast.Body>Checkout successful!</Toast.Body>
            </Toast>
          </>
        )}
      </Container>
      <Footer />
    </motion.div>
  );
};

export default Home;
