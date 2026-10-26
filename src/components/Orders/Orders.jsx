import Footer from "../Footer/Footer";
import UserOrderHistory from "./UserOrderHistory";
import "./Orders.css";

const Orders = () => {
  return (
    <>
      <main className="home-main">
        <div className="container">
          <header className="orders-page-heading">
            <h1 className="home-title">Your orders</h1>
            <p>Review your past canteen orders and their details.</p>
          </header>
          <UserOrderHistory />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Orders;
