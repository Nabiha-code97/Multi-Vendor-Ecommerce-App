import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllProductsShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">Welcome back, {seller?.name}</h3>
      <div className="flex flex-wrap gap-4">
        <div className="w-full 400px:w-[45%] 800px:w-[22%] bg-white shadow-sm rounded-md p-5">
          <h5 className="text-[16px] text-[#00000094]">Total Products</h5>
          <h4 className="text-[28px] font-[600] pt-2">{products?.length ?? 0}</h4>
        </div>
        <div className="w-full 400px:w-[45%] 800px:w-[22%] bg-white shadow-sm rounded-md p-5">
          <h5 className="text-[16px] text-[#00000094]">Available Balance</h5>
          <h4 className="text-[28px] font-[600] pt-2">${seller?.availableBalance ?? 0}</h4>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-8">
        <Link to="/dashboard-create-product">
          <div className="w-[180px] bg-black h-[45px] flex items-center justify-center rounded-xl cursor-pointer">
            <h5 className="text-white">Create Product</h5>
          </div>
        </Link>
        <Link to="/dashboard-products">
          <div className="w-[180px] border border-black h-[45px] flex items-center justify-center rounded-xl cursor-pointer">
            <h5>View All Products</h5>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHero;
