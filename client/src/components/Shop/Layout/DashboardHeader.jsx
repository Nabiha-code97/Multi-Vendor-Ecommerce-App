import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FiPackage, FiShoppingBag } from "react-icons/fi";

const DashboardHeader = () => {
  const { seller } = useSelector((state) => state.seller);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <Link to="/dashboard">
        <img src="https://shopo.quomodothemes.website/assets/images/logo.svg" alt="" />
      </Link>
      <div className="flex items-center">
        <Link to="/dashboard-orders" className="800px:block hidden">
          <FiShoppingBag color="#555" size={30} className="mx-5 cursor-pointer" />
        </Link>
        <Link to="/dashboard-products" className="800px:block hidden">
          <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
        </Link>
        <Link to="/dashboard-settings">
          <img
            src={seller?.avatar?.url}
            alt=""
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
