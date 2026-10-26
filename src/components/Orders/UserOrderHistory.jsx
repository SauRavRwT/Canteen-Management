import { useState, useEffect, useCallback } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import { useAuth } from '../../AuthContext';
import { Skeleton } from "../Skeleton/Skeleton";
import "./Orders.css";

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState({});
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'desc' });
  const { currentUser } = useAuth();

  useEffect(() => {
    const productsRef = ref(database, 'products');

    const unsubscribe = onValue(productsRef, (snapshot) => {
      const productsData = snapshot.val();
      setProducts(productsData || {});
      setProductsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const processOrders = useCallback((salesData) => {
    if (!salesData) return [];

    return Object.entries(salesData).map(([date, dailySales]) => {
      return Object.entries(dailySales)
        .filter((entry) => entry[1].userEmail === currentUser?.email)
        .map(([orderId, sale]) => ({
          id: orderId,
          date: new Date(date),
          items: sale.items?.map(item => ({
            ...item,
            name: products[item.id]?.name || `Product ${item.id}`,
            price: item.price || products[item.id]?.price || 0
          })) || [],
          total: sale.total || sale.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0,
          status: sale.status || 'Completed'
        }));
    }).flat();
  }, [products, currentUser?.email]);

  useEffect(() => {
    const salesRef = ref(database, 'sales');

    const unsubscribe = onValue(salesRef, (snapshot) => {
      const salesData = snapshot.val();
      const processedOrders = processOrders(salesData);
      setOrders(processedOrders);
      setOrdersLoading(false);
    });

    return () => unsubscribe();
  }, [processOrders]);

  const sortOrders = (ordersToSort) => {
    return [...ordersToSort].sort((a, b) => {
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? a.date - b.date
          : b.date - a.date;
      }
      if (sortConfig.key === 'total') {
        return sortConfig.direction === 'asc'
          ? a.total - b.total
          : b.total - a.total;
      }
      return 0;
    });
  };

  const filterOrders = (ordersToFilter) => {
    return ordersToFilter.filter(order =>
      order.items.some(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const isLoading = ordersLoading || productsLoading;
  const visibleOrders = filterOrders(sortOrders(orders));

  return (
    <section className="orders-history glass-card">
      <div className="orders-history-header">
        <h2 className="orders-history-title">My Order History</h2>
        <input
          type="search"
          id="order-search"
          placeholder="Search by product name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control orders-search-input"
          aria-label="Search orders by product name"
        />
      </div>
      <div className="orders-history-content">
        <div className="table-responsive" aria-busy={isLoading}>
          {isLoading && (
            <span className="skeleton-announcement" role="status">Loading order history...</span>
          )}
          <table className="orders-history-table">
            <thead>
              <tr>
                <th
                  scope="col"
                  aria-sort={sortConfig.key === 'date' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button type="button" className="orders-sort-button" onClick={() => handleSort('date')}>
                    Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th scope="col">Order ID</th>
                <th scope="col">Items</th>
                <th
                  scope="col"
                  aria-sort={sortConfig.key === 'total' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
                >
                  <button type="button" className="orders-sort-button" onClick={() => handleSort('total')}>
                    Total {sortConfig.key === 'total' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                  </button>
                </th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }, (_, index) => (
                  <tr key={index} aria-hidden="true">
                    {Array.from({ length: 5 }, (_, columnIndex) => (
                      <td key={columnIndex}>
                        <Skeleton className="history-skeleton-cell" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : visibleOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="orders-empty-state">
                    {orders.length === 0 ? "No orders found" : "No orders match your search"}
                  </td>
                </tr>
              ) : (
                visibleOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="orders-date">{formatDate(order.date)}</td>
                    <td className="orders-id">{order.id}</td>
                    <td>
                      {order.items.map((item, index) => (
                        <div key={index} className="orders-item">
                          <span className="orders-item-quantity">{item.quantity}x</span> {item.name} <span className="orders-item-price">(₹{item.price} each)</span>
                        </div>
                      ))}
                    </td>
                    <td className="orders-total">₹{order.total.toFixed(2)}</td>
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
    </section>
  );
};

export default UserOrderHistory;
