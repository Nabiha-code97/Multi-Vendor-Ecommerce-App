import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminDashboardLayout from "../components/Admin/Layout/AdminDashboardLayout";
import AllWithdraws from "../components/Admin/AllWithdraws";

const AdminDashboardWithdrawsPage = () => {
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
    <AdminDashboardLayout active={6}>
      <AllWithdraws />
    </AdminDashboardLayout>
  );
};

export default AdminDashboardWithdrawsPage;
