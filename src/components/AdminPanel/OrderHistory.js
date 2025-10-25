import React, { useState, useEffect, useCallback } from "react";
import { Card, Table, Form } from "react-bootstrap";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
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

  // Sticky header style for table
  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 2,
  };

  return (
    <Card className="mt-4">
      <Card.Header>
        <Card.Title>Order History</Card.Title>
        <Form.Control
          id="search"
          name="search"
          type="text"
          placeholder="Search your order..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
          style={{ maxWidth: "300px" }}
        />
      </Card.Header>
      <Card.Body>
        <div
          className="table-responsive"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <Table striped bordered hover>
            <thead>
              <tr>
                <th
                  style={{ ...stickyHeaderStyle, cursor: "pointer" }}
                  onClick={() => handleSort("date")}
                >
                  Date{" "}
                  {sortConfig.key === "date" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th style={stickyHeaderStyle}>Order ID</th>
                <th style={stickyHeaderStyle}>User Email</th>
                <th style={stickyHeaderStyle}>Items</th>
                <th
                  style={{ ...stickyHeaderStyle, cursor: "pointer" }}
                  onClick={() => handleSort("total")}
                >
                  Total{" "}
                  {sortConfig.key === "total" &&
                    (sortConfig.direction === "asc" ? "↑" : "↓")}
                </th>
                <th style={stickyHeaderStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    No orders found
                  </td>
                </tr>
              ) : (
                filterOrders(sortOrders(orders)).map((order) => (
                  <tr key={order.id}>
                    <td>{formatDate(order.date)}</td>
                    <td>{order.id}</td>
                    <td>{order.userEmail}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index}>
                          {item.quantity}x {item.name} (₹{item.price} each)
                        </div>
                      ))}
                    </td>
                    <td>₹{order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default OrderHistory;
