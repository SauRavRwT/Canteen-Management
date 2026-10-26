import "./ProductList.css";
import { FaPlus, FaEye } from "react-icons/fa";
import { Skeleton } from "../Skeleton/Skeleton";

const ProductList = ({ products, addToCart, onProductClick, loading = false }) => {
  if (loading) {
    return (
      <div className="products-grid" role="status" aria-label="Loading products">
        <span className="skeleton-announcement">Loading products...</span>
        {Array.from({ length: 6 }, (_, index) => (
          <div className="product-card-wrapper" key={index} aria-hidden="true">
            <div className="product-card product-card-skeleton">
              <div className="product-image-container">
                <Skeleton className="product-skeleton-image" />
              </div>
              <div className="product-body">
                <Skeleton className="product-skeleton-name" />
                <Skeleton className="product-skeleton-price" />
                <Skeleton className="product-skeleton-quantity" />
                <Skeleton className="product-skeleton-button" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Validate and sanitize products
  const validProducts = (products || []).map(product => ({
    ...product,
    price: product.price ?? 0,
    quantity: product.quantity ?? 0,
    name: product.name ?? 'Unknown Product',
    image: product.image ?? 'https://via.placeholder.com/300',
  }));
  return (
    <div className="products-grid">
      {validProducts.map((product) => (
        <div
          key={product.id} 
          className="product-card-wrapper"
        >
          <div className="product-card">
            <div className="product-image-container">
              <img
                src={product.image}
                className="product-image"
                alt={product.name}
                loading="lazy"
                decoding="async"
              />
              <div className="product-overlay">
                <button
                  className="overlay-btn view-btn"
                  onClick={() => onProductClick(product)}
                >
                  <FaEye /> View Details
                </button>
              </div>
              {product.quantity === 0 && (
                <div className="stock-badge out-of-stock">Out of Stock</div>
              )}
              {product.quantity > 0 && product.quantity <= 3 && (
                <div className="stock-badge low-stock">Low Stock</div>
              )}
            </div>
            
            <div className="product-body">
              <h5 className="product-name">{product.name}</h5>
              
              <div className="product-price">₹{(Number(product.price) || 0).toFixed(2)}</div>
              
              <div className="product-quantity">
                <span className="qty-label">Available:</span>
                <span className="qty-value">{Number(product.quantity) || 0}</span>
              </div>
              
              <button
                className="product-add-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product);
                }}
                disabled={product.quantity === 0}
              >
                <FaPlus /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
