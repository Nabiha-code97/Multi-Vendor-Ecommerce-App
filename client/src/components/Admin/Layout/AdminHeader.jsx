import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const AdminHeader = () => {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <Link to="/admin-dashboard">
        <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="" />
      </Link>
      <div className="flex items-center">
        <h5 className="text-[#00000094] mr-4 hidden 800px:block">Admin</h5>
        <img
          src={user?.avatar?.url}
          alt=""
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
      </div>
    </div>
  );
};

export default AdminHeader;
