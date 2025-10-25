import React from "react";
import { Card, Table } from "react-bootstrap";

const SummaryComponent = ({ data, title }) => {
  const totalProfit = data.reduce((sum, item) => sum + item.value, 0);

  // Sticky header style for table
  const stickyHeaderStyle = {
    position: "sticky",
    top: 0,
    background: "#fff",
    zIndex: 2,
  };

  return (
    <Card className="mb-4">
      <Card.Header>{title} Summary</Card.Header>
      <Card.Body>
        <div
          className="table-responsive"
          style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
        >
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={stickyHeaderStyle}>Product</th>
                <th style={stickyHeaderStyle}>Profit (₹)</th>
                <th style={stickyHeaderStyle}>Percentage</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                const percent = totalProfit
                  ? (item.value / totalProfit) * 100
                  : 0;
                return (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>₹{item.value.toFixed(2)}</td>
                    <td>{percent.toFixed(2)}%</td>
                  </tr>
                );
              })}
              <tr className="table-info">
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>₹{totalProfit.toFixed(2)}</strong>
                </td>
                <td>100%</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SummaryComponent;
