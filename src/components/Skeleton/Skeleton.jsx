import { FaSearch, FaChartLine, FaBox, FaClipboardList } from "react-icons/fa";
import Footer from "../Footer/Footer";
import "./Skeleton.css";
// Lazy-loaded pages ship their CSS with their chunk. Importing it here keeps the
// skeleton laid out with the exact same classes before that chunk arrives, so
// nothing shifts when the real page replaces the placeholder.
import "../AdminPanel/AdminPanel.css";
import "../AdminPanel/SummaryComponent.css";
import "../AdminPanel/BestSellersComponent.css";
import "../About/About.css";
import "../Home/Home.css";
import "../ProductList/ProductList.css";
import "../Orders/Orders.css";

/* Primitives */

export const Skeleton = ({ className = "", as: Element = "div", style }) => (
  <Element className={`skeleton ${className}`} style={style} aria-hidden="true" />
);

const Announcement = ({ children }) => (
  <span className="skeleton-announcement">{children}</span>
);

const range = (length) => Array.from({ length }, (_, index) => index);

/* Product grid (shared by the Home page and its route skeleton) */

export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="products-grid" role="status" aria-label="Loading products">
    <Announcement>Loading products...</Announcement>
    {range(count).map((index) => (
      <div className="product-card-wrapper" key={index} aria-hidden="true">
        <div className="product-card product-card-skeleton">
          <div className="product-image-container">
            <Skeleton className="product-skeleton-image" />
          </div>
          <div className="product-body">
            <Skeleton
              className="product-skeleton-name"
              style={{ width: `${[78, 62, 70, 55][index % 4]}%` }}
            />
            <Skeleton className="product-skeleton-price" />
            <Skeleton className="product-skeleton-quantity" />
            <Skeleton className="product-skeleton-button" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

/* Table rows (shared by user and admin order history) */

const CELL_WIDTHS = ["88%", "70%", "92%", "56%", "64%", "60%"];

export const TableRowsSkeleton = ({ rows = 4, columns = 5 }) =>
  range(rows).map((row) => (
    <tr key={row} aria-hidden="true">
      {range(columns).map((column) => (
        <td key={column}>
          <Skeleton
            className="history-skeleton-cell"
            style={{ width: CELL_WIDTHS[(column + row) % CELL_WIDTHS.length] }}
          />
        </td>
      ))}
    </tr>
  ));

/* Home */

export const HomePageSkeleton = () => (
  <div className="home-wrapper">
    <main className="home-main">
      <div className="container">
        <div className="home-header">
          <h1 className="home-title">Today's items</h1>
          <div className="home-search-wrapper">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="home-search-input"
              placeholder="Search products..."
              aria-label="Search Products"
              disabled
            />
          </div>
        </div>
        <ProductGridSkeleton />
      </div>
    </main>
    <Footer />
  </div>
);

/* Orders */

export const OrdersPageSkeleton = () => (
  <>
    <main className="home-main" role="status" aria-label="Loading orders">
      <Announcement>Loading orders...</Announcement>
      <div className="container">
        <header className="orders-page-heading">
          <h1 className="home-title">Your orders</h1>
          <p>Review your past canteen orders and their details.</p>
        </header>
        <section className="orders-history glass-card">
          <div className="orders-history-header">
            <h2 className="orders-history-title">My Order History</h2>
            <input
              type="search"
              placeholder="Search by product name..."
              className="form-control orders-search-input"
              aria-label="Search orders by product name"
              disabled
            />
          </div>
          <div className="orders-history-content">
            <div className="table-responsive">
              <table className="orders-history-table">
                <thead>
                  <tr>
                    <th scope="col">Date ↓</th>
                    <th scope="col">Order ID</th>
                    <th scope="col">Items</th>
                    <th scope="col">Total</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <TableRowsSkeleton columns={5} />
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </main>
    <Footer />
  </>
);

/* About */

export const AboutPageSkeleton = () => (
  <div className="about-container" role="status" aria-label="Loading about page">
    <Announcement>Loading about page...</Announcement>
    <div className="about-hero">
      <div className="hero-content about-skeleton-center">
        <Skeleton className="about-skeleton-title" />
        <Skeleton className="about-skeleton-title about-skeleton-title-short" />
        <Skeleton className="about-skeleton-line" />
        <Skeleton className="about-skeleton-line about-skeleton-line-short" />
        <Skeleton className="about-skeleton-cta" />
      </div>
    </div>

    <section>
      <div className="section-header about-skeleton-center">
        <Skeleton className="about-skeleton-heading" />
        <Skeleton className="about-skeleton-line" />
        <Skeleton className="about-skeleton-line about-skeleton-line-short" />
      </div>
      <div className="features-grid">
        {range(3).map((index) => (
          <div className="feature-card about-skeleton-center" key={index} aria-hidden="true">
            <Skeleton className="about-skeleton-icon" />
            <Skeleton className="about-skeleton-card-title" />
            <Skeleton className="about-skeleton-card-line" />
            <Skeleton className="about-skeleton-card-line about-skeleton-line-short" />
          </div>
        ))}
      </div>
    </section>

    <section>
      <div className="section-header about-skeleton-center">
        <Skeleton className="about-skeleton-heading" />
      </div>
      <div className="workflow-timeline">
        {range(3).map((index) => (
          <div className="workflow-item" key={index} aria-hidden="true">
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <Skeleton className="about-skeleton-step-title" />
              <Skeleton className="about-skeleton-step-line" />
            </div>
          </div>
        ))}
      </div>
    </section>

    <section className="section-project-link">
      <Skeleton className="about-skeleton-github" />
    </section>
    <Footer />
  </div>
);

/* Admin */

const ADMIN_TABS = [
  { id: "overview", label: "Overview", icon: FaChartLine },
  { id: "products", label: "Products", icon: FaBox },
  { id: "orders", label: "Orders", icon: FaClipboardList },
];

/** Static replica of the admin tab bar, shown while admin status is verified. */
export const AdminTabsSkeleton = ({ activeTab = "overview" }) => (
  <div className="admin-tabs" aria-hidden="true">
    {ADMIN_TABS.map((tab) => (
      <span
        key={tab.id}
        className={`admin-tab admin-tab-placeholder ${activeTab === tab.id ? "active" : ""}`}
      >
        <tab.icon className="tab-icon" />
        {tab.label}
      </span>
    ))}
  </div>
);

export const AdminOverviewSkeleton = () => (
  <div className="admin-content" role="status" aria-label="Loading analytics">
    <Announcement>Loading analytics...</Announcement>
    <div className="admin-grid">
      {["weekly", "monthly", "yearly"].map((period) => (
        <div className="admin-skeleton-column" key={period} aria-hidden="true">
          <div className="glass-card admin-skeleton-chart-card">
            <div className="admin-skeleton-card-header">
              <Skeleton className="admin-skeleton-heading" />
            </div>
            <div className="admin-skeleton-chart">
              <div className="admin-skeleton-donut" />
              <div className="admin-skeleton-legend">
                <Skeleton className="admin-skeleton-legend-line" />
                <Skeleton className="admin-skeleton-legend-line" />
                <Skeleton className="admin-skeleton-legend-line" />
              </div>
            </div>
          </div>
          <div className="summary-card admin-skeleton-summary">
            <div className="admin-skeleton-summary-heading">
              <Skeleton className="admin-skeleton-summary-title" />
              <Skeleton className="admin-skeleton-summary-total" />
            </div>
            <div className="admin-skeleton-table-heading">
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
            {range(3).map((index) => (
              <div className="admin-skeleton-table-row" key={index}>
                <Skeleton />
                <Skeleton />
                <Skeleton />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="best-sellers-card admin-skeleton-bestsellers" aria-hidden="true">
      <Skeleton className="admin-skeleton-heading" />
      {range(3).map((index) => (
        <div className="admin-skeleton-best-row" key={index}>
          <Skeleton className="admin-skeleton-rank" />
          <Skeleton className="admin-skeleton-best-name" />
          <Skeleton className="admin-skeleton-best-quantity" />
        </div>
      ))}
    </div>
  </div>
);

export const AdminProductsSkeleton = () => (
  <div className="admin-products-grid" role="status" aria-label="Loading products">
    <Announcement>Loading products...</Announcement>
    {["product-form", "quantity-form"].map((form) => (
      <div className="glass-card admin-skeleton-form" key={form} aria-hidden="true">
        <Skeleton className="admin-skeleton-heading" />
        <Skeleton className="admin-skeleton-form-copy" />
        {range(3).map((index) => (
          <div className="admin-skeleton-field" key={index}>
            <Skeleton className="admin-skeleton-field-label" />
            <Skeleton className="admin-skeleton-field-input" />
          </div>
        ))}
        <Skeleton className="admin-skeleton-form-button" />
      </div>
    ))}
  </div>
);

/** Mirrors the real AdminPanel markup: same header text, tabs and grid. */
export const AdminDashboardSkeleton = () => (
  <div className="admin-panel-container">
    <div className="admin-wrapper">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-subtitle">Manage your canteen operations efficiently</p>
      </div>
      <AdminTabsSkeleton />
      <AdminOverviewSkeleton />
    </div>
  </div>
);

export const AdminHomeSkeleton = () => (
  <div className="home-wrapper">
    <main className="home-main">
      <div className="container">
        <AdminDashboardSkeleton />
      </div>
    </main>
    <Footer />
  </div>
);

/* Route lookup: one place decides which skeleton a path gets, so the auth
   gate and the lazy-route fallback always show the same placeholder. */

export const RouteSkeleton = ({ pathname, showAdmin = false }) => {
  if (pathname === "/") return showAdmin ? <AdminHomeSkeleton /> : <HomePageSkeleton />;
  if (pathname === "/orders") return <OrdersPageSkeleton />;
  if (pathname === "/about") return <AboutPageSkeleton />;
  return <HomePageSkeleton />;
};
