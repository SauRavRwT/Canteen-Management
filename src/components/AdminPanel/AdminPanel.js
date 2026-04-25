import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { database } from "../../firebase";
import { ref, onValue } from "firebase/database";
import OrderHistory from "./OrderHistory.js";
import ChartComponent from "./ChartComponent";
import SummaryComponent from "./SummaryComponent";
import BestSellersComponent from "./BestSellersComponent";
import AddProductForm from "./AddProductForm";
import UpdateQuantityForm from "./UpdateQuantityForm";
import { useNavigate } from 'react-router-dom';
import useAdmin from '../../hooks/useAdmin';
import { FaChartLine, FaBox, FaClipboardList } from "react-icons/fa";
import "./AdminPanel.css";

const AdminPanel = () => {
  const navigate = useNavigate();
  const isAdmin = useAdmin();

  const [salesData, setSalesData] = useState({
    weekly: [],
    monthly: [],
    yearly: [],
    bestSellers: [],
  });
  const [initialPrices, setInitialPrices] = useState({});
  const [products, setProducts] = useState({});
  const [rawSalesData, setRawSalesData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  const dateRanges = useMemo(() => {
    const now = new Date();
    return {
      oneWeekAgo: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      oneMonthAgo: new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        now.getDate()
      ),
      oneYearAgo: new Date(
        now.getFullYear() - 1,
        now.getMonth(),
        now.getDate()
      ),
    };
  }, []);

  const convertToChartFormat = useCallback(
    (data) => {
      return Object.entries(data)
        .map(([id, value]) => ({
          name: products[id]?.name || "Unknown Product",
          value: value || 0,
        }))
        .filter((item) => item.name !== "Unknown Product");
    },
    [products]
  );

  const processData = useCallback(
    (data) => {
      if (!data)
        return { weekly: [], monthly: [], yearly: [], bestSellers: [] };

      const bestSellers = {};
      const weekly = {};
      const monthly = {};
      const yearly = {};

      Object.entries(data).forEach(([date, dailySales]) => {
        if (!dailySales) return;

        const saleDate = new Date(date);

        Object.values(dailySales).forEach((sale) => {
          if (!sale?.items?.length) return;

          sale.items.forEach((item) => {
            if (!item?.id || !item?.quantity || !item?.price) return;

            bestSellers[item.id] = (bestSellers[item.id] || 0) + item.quantity;

            const revenue = item.price * item.quantity;
            const cost = (initialPrices[item.id] || 0) * item.quantity;
            const profit = revenue - cost;

            if (saleDate >= dateRanges.oneWeekAgo) {
              weekly[item.id] = (weekly[item.id] || 0) + profit;
            }
            if (saleDate >= dateRanges.oneMonthAgo) {
              monthly[item.id] = (monthly[item.id] || 0) + profit;
            }
            if (saleDate >= dateRanges.oneYearAgo) {
              yearly[item.id] = (yearly[item.id] || 0) + profit;
            }
          });
        });
      });

      const sortedBestSellers = Object.entries(bestSellers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

      return {
        weekly: convertToChartFormat(weekly),
        monthly: convertToChartFormat(monthly),
        yearly: convertToChartFormat(yearly),
        bestSellers: sortedBestSellers.map(([id, quantity]) => ({
          id,
          name: products[id]?.name || "Unknown Product",
          quantity,
        })),
      };
    },
    [dateRanges, initialPrices, products, convertToChartFormat]
  );

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  useEffect(() => {
    const productsRef = ref(database, "products");
    const productsUnsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const prices = Object.entries(data).reduce((acc, [id, product]) => {
          acc[id] = product.initialPrice || 0;
          return acc;
        }, {});
        setInitialPrices(prices);
        setProducts(data);
      }
    });

    return () => productsUnsubscribe();
  }, []);

  useEffect(() => {
    const salesRef = ref(database, "sales");
    const salesUnsubscribe = onValue(salesRef, (snapshot) => {
      const data = snapshot.val();
      setRawSalesData(data);
      setLoading(false);
    });

    return () => salesUnsubscribe();
  }, []);

  useEffect(() => {
    if (rawSalesData && Object.keys(products).length > 0) {
      const processedData = processData(rawSalesData);
      setSalesData(processedData);
    }
  }, [rawSalesData, products, processData]);

  const adminTabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'products', label: 'Products', icon: FaBox },
    { id: 'orders', label: 'Orders', icon: FaClipboardList }
  ];

  return (
    <Container fluid className="admin-panel-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="admin-wrapper"
      >
        <div className="admin-header">
          <h1 className="admin-title">Admin Dashboard</h1>
          <p className="admin-subtitle">Manage your canteen operations efficiently</p>
        </div>

        {isAdmin && (
          <>
            <div className="admin-tabs">
              {adminTabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="tab-icon" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="admin-content"
                >
                  {loading ? (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Loading analytics...</p>
                    </div>
                  ) : (
                    <>
                      <Row className="statistics-row">
                        <Col xs={12} md={12} lg={12}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <ChartComponent
                              data={salesData.weekly}
                              title="Weekly Profit Distribution"
                            />
                            <SummaryComponent data={salesData.weekly} title="Weekly" />
                          </motion.div>
                        </Col>
                        <Col xs={12} md={12} lg={12}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.15 }}
                          >
                            <ChartComponent
                              data={salesData.monthly}
                              title="Monthly Profit Distribution"
                            />
                            <SummaryComponent data={salesData.monthly} title="Monthly" />
                          </motion.div>
                        </Col>
                        <Col xs={12} md={12} lg={12}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <ChartComponent
                              data={salesData.yearly}
                              title="Yearly Profit Distribution"
                            />
                            <SummaryComponent data={salesData.yearly} title="Yearly" />
                          </motion.div>
                        </Col>
                      </Row>
                      <Row className="sellers-row">
                        <Col xs={12}>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.25 }}
                          >
                            <BestSellersComponent bestSellers={salesData.bestSellers} />
                          </motion.div>
                        </Col>
                      </Row>
                    </>
                  )}
                </motion.div>
              )}

              {activeTab === 'products' && (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="admin-content"
                >
                  <Row>
                    <Col xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <AddProductForm />
                      </motion.div>
                    </Col>
                    <Col xs={12} md={6}>
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <UpdateQuantityForm products={products} setProducts={setProducts} />
                      </motion.div>
                    </Col>
                  </Row>
                </motion.div>
              )}

              {activeTab === 'orders' && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="admin-content"
                >
                  <Row>
                    <Col xs={12}>
                      <OrderHistory isAdmin={true} />
                    </Col>
                  </Row>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </motion.div>
    </Container>
  );
};

export default AdminPanel;
