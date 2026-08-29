import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminDashboardLayout from "../components/Admin/Layout/AdminDashboardLayout";
import AllUsers from "../components/Admin/AllUsers";

const AdminDashboardUsersPage = () => {
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
    <AdminDashboardLayout active={4}>
      <AllUsers />
    </AdminDashboardLayout>
  );
};

export default AdminDashboardUsersPage;
