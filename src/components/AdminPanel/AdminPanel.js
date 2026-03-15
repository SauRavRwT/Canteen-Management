import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
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

  // Memoize the date calculations
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

  // Convert data to chart format - memoized
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

  // Process sales data
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

  // Effect for products data
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

  // Effect for sales data
  useEffect(() => {
    const salesRef = ref(database, "sales");

    const salesUnsubscribe = onValue(salesRef, (snapshot) => {
      const data = snapshot.val();
      setRawSalesData(data);
    });

    return () => salesUnsubscribe();
  }, []);

  // Effect to process sales data when dependencies change
  useEffect(() => {
    if (rawSalesData && Object.keys(products).length > 0) {
      const processedData = processData(rawSalesData);
      setSalesData(processedData);
    }
  }, [rawSalesData, products, processData]);

  const renderAdminContent = () => (
    <>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <ChartComponent
            data={salesData.weekly}
            title="Weekly Profit Distribution"
          />
          <SummaryComponent data={salesData.weekly} title="Weekly" />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <ChartComponent
            data={salesData.monthly}
            title="Monthly Profit Distribution"
          />
          <SummaryComponent data={salesData.monthly} title="Monthly" />
        </Col>
        <Col xs={12} md={6} lg={4}>
          <ChartComponent
            data={salesData.yearly}
            title="Yearly Profit Distribution"
          />
          <SummaryComponent data={salesData.yearly} title="Yearly" />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <BestSellersComponent bestSellers={salesData.bestSellers} />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <OrderHistory isAdmin={true} />
        </Col>
      </Row>  
      <Row>
        <Col xs={12} md={6}>
          <AddProductForm />
        </Col>
        <Col xs={12} md={6}>
          <UpdateQuantityForm products={products} setProducts={setProducts} />
        </Col>
      </Row>
    </>
  );

  const renderUserContent = () => (
    <>
      <Row>
        <Col xs={12}>
          <OrderHistory isAdmin={false} />
        </Col>
      </Row>
    </>
  );

  return (
    <Container fluid>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="my-4 fw-bold">{isAdmin ? "Admin Panel" : "User Dashboard"}</h1>
        {isAdmin ? renderAdminContent() : renderUserContent()}
      </motion.div>
    </Container>
  );
};

export default AdminPanel;
