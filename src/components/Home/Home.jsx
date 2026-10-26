import { useState, useMemo, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import ProductList from "../ProductList/ProductList";
import CartModal from "../CartModal/CartModal";
import ProductDetailModal from "../ProductDetail/ProductDetailModal";
import Footer from "../Footer/Footer";
const AdminPanel = lazy(() => import("../AdminPanel/AdminPanel"));
import useProducts from "../../hooks/useProducts";
import { useAuth } from "../../AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../hooks/useCart";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import "./Home.css";
import { AdminDashboardSkeleton } from "../Skeleton/Skeleton";

const Home = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const { products, loading: productsLoading, updateProductQuantity } = useProducts();
  const originalQuantities = useMemo(() => {
    if (!products || products.length === 0) return {};
    return products.reduce((acc, product) => {
      acc[product.id] = product.quantity;
      return acc;
    }, {});
  }, [products]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetailModal, setShowProductDetailModal] = useState(false);
  const showAdmin = location.state?.showAdmin === true;

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



  const filteredProducts = useMemo(() => {
    const normalizedSearchTerm = searchTerm.toLowerCase();
    return (products || []).filter((product) =>
      (product.name || "").toLowerCase().includes(normalizedSearchTerm),
    );
  }, [products, searchTerm]);

  const visibleProducts = useMemo(() => {
    const cartQuantities = new Map(
      cart.map((product) => [product.id, product.quantity]),
    );
    return filteredProducts.map((product) => ({
      ...product,
      quantity:
        originalQuantities[product.id] -
        (cartQuantities.get(product.id) || 0),
    }));
  }, [cart, filteredProducts, originalQuantities]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetailModal(true);
  };

  return (
    <motion.div
      className="home-wrapper"
      initial={false}
      animate={{ opacity: 1 }}
    >
      <main className="home-main">
        <div className="container">
          {showAdmin && currentUser ? (
            <Suspense fallback={
              <AdminDashboardSkeleton />
            }>
              <AdminPanel />
            </Suspense>
          ) : (
            <>
              {/* Page header + Search */}
              <div className="home-header">
                <h1 className="home-title">Today's items</h1>
                <div className="home-search-wrapper">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    id="searchInput"
                    className="home-search-input"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Search Products"
                  />
                </div>
              </div>

              {/* Floating cart button */}
              <AnimatePresence>
                {cart.length > 0 && (
                  <motion.button
                    className="floating-cart-btn"
                    onClick={() => setShowCartModal(true)}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaShoppingCart />
                    <span>View Cart</span>
                    <span className="cart-count-badge">{cart.length}</span>
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Product list */}
              {productsLoading ? (
                <ProductList loading />
              ) : filteredProducts.length > 0 ? (
                <ProductList
                  products={visibleProducts}
                  addToCart={addToCart}
                  onProductClick={handleProductClick}
                />
              ) : (
                <div className="empty-state">
                  <div className="empty-content">
                    <span className="empty-emoji">🍽️</span>
                    <h3>Sorry, we're currently not serving any items.</h3>
                    <p>
                      Please check back later or contact{" "}
                      <a href="https://github.com/SauRavRwT/">maintainer</a>!
                    </p>
                  </div>
                </div>
              )}

              {/* Modals */}
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

              {/* Checkout success toast */}
              <AnimatePresence>
                {showCheckoutToast && (
                  <motion.div
                    className="toast-container"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                  >
                    <div className="toast toast-success">
                      ✅ Checkout successful!
                      <button className="toast-close" onClick={() => setShowCheckoutToast(false)}>×</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default Home;
