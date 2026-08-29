import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/Shop/Layout/DashboardLayout";
import WithdrawMoney from "../components/Shop/WithdrawMoney";

const ShopWithdrawPage = () => {
  const navigate = useNavigate();
  const { isSeller, isLoading } = useSelector((state) => state.seller);

  useEffect(() => {
    if (!isLoading && !isSeller) {
      navigate("/shop-login");
    }
  }, [isLoading, isSeller, navigate]);

  if (!isSeller) {
    return null;
  }

  return (
    <DashboardLayout active={8}>
      <WithdrawMoney />
    </DashboardLayout>
  );
};

export default ShopWithdrawPage;
