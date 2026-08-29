import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineMoneyCollect } from "react-icons/ai";
import { MdBorderClear } from "react-icons/md";
import { getAllOrdersAdmin } from "../../redux/actions/order";
import { getAllSellersAdmin } from "../../redux/actions/seller";

const AdminDashboardMain = () => {
  const dispatch = useDispatch();
  const { adminOrders, adminOrdersLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);

  useEffect(() => {
    dispatch(getAllOrdersAdmin());
    dispatch(getAllSellersAdmin());
  }, [dispatch]);

  // only Delivered orders have actually settled (see server's updateOrderStatus, which
  // pays the seller their 90% cut on delivery) — counting Pending/unpaid orders here
  // would overstate real platform earnings
  const platformEarnings = (adminOrders || [])
    .filter((order) => order.status === "Delivered")
    .reduce((acc, order) => acc + order.totalPrice * 0.1, 0);

  const latestOrders = (adminOrders || []).slice(0, 5);

  if (adminOrdersLoading) {
    return <div className="w-full p-8">Loading...</div>;
  }

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">Overview</h3>
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="w-full 400px:w-[45%] 800px:w-[30%] bg-white shadow-sm rounded-md p-5">
          <div className="flex items-center mb-2">
            <AiOutlineMoneyCollect size={26} className="mr-2 text-[#00000085]" />
            <h5 className="text-[16px] text-[#00000094]">Platform Earnings</h5>
          </div>
          <h4 className="text-[26px] font-[600]">${platformEarnings.toFixed(2)}</h4>
        </div>
        <div className="w-full 400px:w-[45%] 800px:w-[30%] bg-white shadow-sm rounded-md p-5">
          <div className="flex items-center mb-2">
            <MdBorderClear size={26} className="mr-2 text-[#00000085]" />
            <h5 className="text-[16px] text-[#00000094]">All Sellers</h5>
          </div>
          <h4 className="text-[26px] font-[600]">{sellers?.length ?? 0}</h4>
          <Link to="/admin-sellers" className="text-[#077f9c]">
            View Sellers
          </Link>
        </div>
        <div className="w-full 400px:w-[45%] 800px:w-[30%] bg-white shadow-sm rounded-md p-5">
          <div className="flex items-center mb-2">
            <AiOutlineMoneyCollect size={26} className="mr-2 text-[#00000085]" />
            <h5 className="text-[16px] text-[#00000094]">All Orders</h5>
          </div>
          <h4 className="text-[26px] font-[600]">{adminOrders?.length ?? 0}</h4>
          <Link to="/admin-orders" className="text-[#077f9c]">
            View Orders
          </Link>
        </div>
      </div>

      <h3 className="text-[22px] font-[600] pb-4">Latest Orders</h3>
      <div className="w-full bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[#00000094]">
              <th className="p-3">Order Id</th>
              <th className="p-3">Status</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {latestOrders.length === 0 && (
              <tr>
                <td className="p-3" colSpan={5}>
                  No orders yet.
                </td>
              </tr>
            )}
            {latestOrders.map((order) => (
              <tr className="border-b" key={order._id}>
                <td className="p-3">#{order._id.slice(-8)}</td>
                <td className="p-3">{order.status}</td>
                <td className="p-3">{order.cart.reduce((acc, item) => acc + item.qty, 0)}</td>
                <td className="p-3">US$ {order.totalPrice}</td>
                <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardMain;
