import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/Shop/Layout/DashboardLayout";
import ShopSettings from "../components/Shop/ShopSettings";

const ShopSettingsPage = () => {
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
    <DashboardLayout active={9}>
      <ShopSettings />
    </DashboardLayout>
  );
};

export default ShopSettingsPage;
