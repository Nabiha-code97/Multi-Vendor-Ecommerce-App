import React from "react";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";
import Payment from "../components/Payment/Payment";

const PaymentPage = () => {
  return (
    <div className="w-full min-h-screen bg-[#f6f9fc]">
      <Header />
      <br />
      <Payment />
      <br />
      <Footer />
    </div>
  );
};

export default PaymentPage;
