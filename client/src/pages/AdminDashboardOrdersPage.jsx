import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminDashboardLayout from "../components/Admin/Layout/AdminDashboardLayout";
import AllOrders from "../components/Admin/AllOrders";

const AdminDashboardOrdersPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, user } = useSelector((state) => state.user);
  const isAdmin = isAuthenticated && user?.role === "admin";

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/login");
    }
  }, [loading, isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <AdminDashboardLayout active={2}>
      <AllOrders />
    </AdminDashboardLayout>
  );
};

export default AdminDashboardOrdersPage;
