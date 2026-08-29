import React from "react";
import AdminHeader from "./AdminHeader";
import AdminSideBar from "./AdminSideBar";

const AdminDashboardLayout = ({ active, children }) => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <AdminHeader />
      <div className="flex flex-1 min-h-0">
        <div className="w-[80px] 800px:w-[330px] h-full overflow-y-auto shrink-0">
          <AdminSideBar active={active} />
        </div>
        <div className="flex-1 h-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
