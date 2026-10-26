import { useState, useEffect, useCallback } from "react";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { Skeleton } from "../Skeleton/Skeleton";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  // Fetch products data
  useEffect(() => {
    const productsRef = ref(database, "products");

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const productsData = snapshot.val();
      setProducts(productsData || {});
      setProductsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Memoize processOrders function with useCallback
  const processOrders = useCallback(
    (salesData) => {
      if (!salesData) return [];

      return Object.entries(salesData)
        .map(([date, dailySales]) => {
          return Object.entries(dailySales).map(([orderId, sale]) => {
            return {
              id: orderId,
              date: new Date(date),
              userEmail: sale.userEmail || "N/A",
              items:
                sale.items?.map((item) => ({
                  ...item,
                  name: products[item.id]?.name || `Product ${item.id}`,
                  price: item.price || products[item.id]?.price || 0,
                })) || [],
              total:
                sale.total ||
                sale.items?.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                ) ||
                0,
              status: sale.status || "Completed",
            };
          });
        })
        .flat();
    },
    [products]
  );

  // Fetch and process sales data
  useEffect(() => {
    const salesRef = ref(database, "sales");

    const unsubscribe = onValue(salesRef, (snapshot) => {
      const salesData = snapshot.val();
      const processedOrders = processOrders(salesData);
      setOrders(processedOrders);
      setOrdersLoading(false);
    });

    return () => unsubscribe();
  }, [processOrders]);

  // Sort orders based on current sort configuration
  const sortOrders = (ordersToSort) => {
    return [...ordersToSort].sort((a, b) => {
      if (sortConfig.key === "date") {
        return sortConfig.direction === "asc"
          ? a.date - b.date
          : b.date - a.date;
      }
      if (sortConfig.key === "total") {
        return sortConfig.direction === "asc"
          ? a.total - b.total
          : b.total - a.total;
      }
      return 0;
    });
  };

  const filterOrders = (ordersToFilter) => {
    return ordersToFilter.filter((order) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.items.some((item) =>
          item.name.toLowerCase().includes(searchLower)
        ) ||
        order.userEmail.toLowerCase().includes(searchLower) ||
        formatDate(order.date).toLowerCase().includes(searchLower)
      );
    });
  };

  // Handle column header click for sorting
  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction:
        prevConfig.key === key && prevConfig.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  // Format date to local string
  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="glass-card" style={{ marginTop: "1rem" }}>
      <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid var(--border-color)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>Order History</h4>
        <input
          id="search"
          name="search"
          type="text"
          placeholder="Search your order..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control"
          style={{ maxWidth: "300px" }}
        />
      </div>
      <div style={{ padding: "1.25rem" }}>
        <div className="table-responsive" aria-busy={ordersLoading || productsLoading} style={{ maxHeight: "400px", overflowY: "auto" }}>
          {(ordersLoading || productsLoading) && (
            <span className="skeleton-announcement" role="status">Loading order history...</span>
          )}
          <table>
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer", position: "sticky", top: 0, background: "var(--glass-bg-strong)", zIndex: 2 }}
                  onClick={() => handleSort("date")}
                >
                  Date {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th style={{ position: "sticky", top: 0, background: "var(--glass-bg-strong)", zIndex: 2 }}>Order ID</th>
                <th style={{ position: "sticky", top: 0, background: "var(--glass-bg-strong)", zIndex: 2 }}>User Email</th>
                <th style={{ position: "sticky", top: 0, background: "var(--glass-bg-strong)", zIndex: 2 }}>Items</th>
                <th
                  style={{ cursor: "pointer", position: "sticky", top: 0, background: "var(--glass-bg-strong)", zIndex: 2 }}
                  onClick={() => handleSort("total")}
                >
                  Total {sortConfig.key === "total" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th style={{ position: "sticky", top: 0, background: "var(--glass-bg-strong)", zIndex: 2 }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading || productsLoading ? (
                Array.from({ length: 4 }, (_, index) => (
                  <tr key={index} aria-hidden="true">
                    {Array.from({ length: 6 }, (_, columnIndex) => (
                      <td key={columnIndex}>
                        <Skeleton className="history-skeleton-cell" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center" style={{ color: "var(--text-secondary)" }}>
                    No orders found
                  </td>
                </tr>
              ) : (
                filterOrders(sortOrders(orders)).map((order) => (
                  <tr key={order.id}>
                    <td style={{ whiteSpace: "nowrap" }}>{formatDate(order.date)}</td>
                    <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{order.id}</td>
                    <td>{order.userEmail}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index} style={{ marginBottom: "0.25rem" }}>
                          <span style={{ fontWeight: 600, color: "var(--primary)" }}>{item.quantity}x</span> {item.name} <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>(₹{item.price} each)</span>
                        </div>
                      ))}
                    </td>
                    <td style={{ fontWeight: 700, color: "var(--primary)" }}>₹{order.total.toFixed(2)}</td>
                    <td>
                      <span className="badge badge-success">{order.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
