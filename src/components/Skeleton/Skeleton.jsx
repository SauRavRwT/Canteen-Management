import "./Skeleton.css";

export const Skeleton = ({ className = "", as: Element = "div" }) => (
  <Element className={`skeleton ${className}`} aria-hidden="true" />
);

export const PageSkeleton = ({ label = "Loading content" }) => (
  <main className="page-skeleton" role="status" aria-label={label}>
    <span className="skeleton-announcement">{label}</span>
    <Skeleton className="page-skeleton-heading" />
    <Skeleton className="page-skeleton-description" />
    <div className="page-skeleton-grid">
      {Array.from({ length: 6 }, (_, index) => (
        <div className="page-skeleton-card" key={index}>
          <Skeleton className="page-skeleton-image" />
          <Skeleton className="page-skeleton-line" />
          <Skeleton className="page-skeleton-line page-skeleton-line-short" />
        </div>
      ))}
    </div>
  </main>
);

export const HomePageSkeleton = () => (
  <div className="home-page-skeleton" role="status" aria-label="Loading home page">
    <span className="skeleton-announcement">Verifying your session...</span>
    <div className="home-skeleton-nav">
      <Skeleton className="home-skeleton-brand" />
      <div className="home-skeleton-nav-items" aria-hidden="true">
        <Skeleton className="home-skeleton-nav-item" />
        <Skeleton className="home-skeleton-nav-item" />
        <Skeleton className="home-skeleton-nav-item home-skeleton-nav-item-circle" />
      </div>
    </div>
    <main className="home-skeleton-main">
      <div className="home-skeleton-heading">
        <Skeleton className="home-skeleton-title" />
        <Skeleton className="home-skeleton-search" />
      </div>
      <div className="home-skeleton-products">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="home-skeleton-product-card" key={index} aria-hidden="true">
            <Skeleton className="home-skeleton-product-image" />
            <div className="home-skeleton-product-body">
              <Skeleton className="home-skeleton-product-name" />
              <Skeleton className="home-skeleton-product-price" />
              <Skeleton className="home-skeleton-product-stock" />
              <Skeleton className="home-skeleton-product-button" />
            </div>
          </div>
        ))}
      </div>
    </main>
    <div className="home-skeleton-footer" aria-hidden="true">
      <Skeleton className="home-skeleton-footer-line" />
      <Skeleton className="home-skeleton-footer-line home-skeleton-footer-line-short" />
    </div>
  </div>
);

export const AboutPageSkeleton = () => (
  <main className="about-page-skeleton" role="status" aria-label="Loading about page">
    <span className="skeleton-announcement">Loading about page...</span>
    <div className="about-skeleton-nav">
      <Skeleton className="about-skeleton-brand" />
      <div className="about-skeleton-nav-links">
        <Skeleton className="about-skeleton-nav-link" />
        <Skeleton className="about-skeleton-nav-link" />
        <Skeleton className="about-skeleton-nav-button" />
      </div>
    </div>

    <section className="about-skeleton-hero">
      <Skeleton className="about-skeleton-title" />
      <Skeleton className="about-skeleton-copy" />
      <Skeleton className="about-skeleton-copy about-skeleton-copy-short" />
      <Skeleton className="about-skeleton-cta" />
    </section>

    <section className="about-skeleton-section">
      <Skeleton className="about-skeleton-section-title" />
      <Skeleton className="about-skeleton-copy about-skeleton-intro" />
      <div className="about-skeleton-feature-grid">
        {Array.from({ length: 6 }, (_, index) => (
          <div className="about-skeleton-feature" key={index} aria-hidden="true">
            <Skeleton className="about-skeleton-icon" />
            <Skeleton className="about-skeleton-card-title" />
            <Skeleton className="about-skeleton-card-copy" />
            <Skeleton className="about-skeleton-card-copy about-skeleton-card-copy-short" />
          </div>
        ))}
      </div>
    </section>

    <section className="about-skeleton-section about-skeleton-lower">
      <Skeleton className="about-skeleton-section-title" />
      <div className="about-skeleton-feature-grid about-skeleton-feature-grid-compact">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="about-skeleton-feature" key={index} aria-hidden="true">
            <Skeleton className="about-skeleton-icon" />
            <Skeleton className="about-skeleton-card-title" />
            <Skeleton className="about-skeleton-card-copy" />
          </div>
        ))}
      </div>
    </section>
  </main>
);

const AdminOverviewSkeletonContent = () => (
  <div className="admin-skeleton-grid">
    {["weekly", "monthly", "yearly"].map((period) => (
      <div className="admin-skeleton-column" key={period} aria-hidden="true">
        <div className="admin-skeleton-card admin-skeleton-chart-card">
          <Skeleton className="admin-skeleton-heading" />
          <div className="admin-skeleton-chart">
            <Skeleton className="admin-skeleton-donut" />
            <div className="admin-skeleton-legend">
              <Skeleton className="admin-skeleton-legend-line" />
              <Skeleton className="admin-skeleton-legend-line" />
              <Skeleton className="admin-skeleton-legend-line" />
            </div>
          </div>
        </div>
        <div className="admin-skeleton-card admin-skeleton-summary">
          <div className="admin-skeleton-summary-heading">
            <Skeleton className="admin-skeleton-summary-title" />
            <Skeleton className="admin-skeleton-summary-total" />
          </div>
          <div className="admin-skeleton-table-heading">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
          {Array.from({ length: 3 }, (_, index) => (
            <div className="admin-skeleton-table-row" key={index}>
              <Skeleton />
              <Skeleton />
              <Skeleton />
            </div>
          ))}
        </div>
      </div>
    ))}
    <div className="admin-skeleton-card admin-skeleton-bestsellers" aria-hidden="true">
      <Skeleton className="admin-skeleton-heading" />
      {Array.from({ length: 3 }, (_, index) => (
        <div className="admin-skeleton-best-row" key={index}>
          <Skeleton className="admin-skeleton-rank" />
          <Skeleton className="admin-skeleton-best-name" />
          <Skeleton className="admin-skeleton-best-quantity" />
        </div>
      ))}
    </div>
  </div>
);

export const AdminOverviewSkeleton = () => (
  <div role="status" aria-label="Loading analytics">
    <span className="skeleton-announcement">Loading analytics...</span>
    <AdminOverviewSkeletonContent />
  </div>
);

export const AdminDashboardSkeleton = () => (
  <main className="admin-panel-container" role="status" aria-label="Loading admin dashboard">
    <span className="skeleton-announcement">Loading admin dashboard...</span>
    <div className="admin-wrapper">
      <div className="admin-header">
        <Skeleton className="admin-skeleton-page-title" />
        <Skeleton className="admin-skeleton-page-subtitle" />
      </div>
      <div className="admin-skeleton-tabs" aria-hidden="true">
        <Skeleton className="admin-skeleton-tab admin-skeleton-tab-active" />
        <Skeleton className="admin-skeleton-tab" />
        <Skeleton className="admin-skeleton-tab" />
      </div>
      <AdminOverviewSkeletonContent />
    </div>
  </main>
);

export const AdminProductsSkeleton = () => (
  <div className="admin-products-grid admin-products-skeleton" role="status" aria-label="Loading products">
    <span className="skeleton-announcement">Loading products...</span>
    {["product-form", "quantity-form"].map((form) => (
      <div className="admin-skeleton-card admin-skeleton-form" key={form} aria-hidden="true">
        <Skeleton className="admin-skeleton-heading" />
        <Skeleton className="admin-skeleton-form-copy" />
        {Array.from({ length: 3 }, (_, index) => (
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
