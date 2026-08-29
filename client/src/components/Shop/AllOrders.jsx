import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineEye } from "react-icons/ai";
import { getSellerOrders } from "../../redux/actions/order";

const statusColors = {
  "Pending Payment": "bg-gray-100 text-gray-600",
  "Payment Failed": "bg-red-100 text-red-600",
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  "Refund Requested": "bg-orange-100 text-orange-700",
  Refunded: "bg-purple-100 text-purple-700",
};

const AllOrders = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getSellerOrders());
  }, [dispatch]);

  if (isLoading) {
    return <div className="w-full p-8">Loading...</div>;
  }

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">All Orders</h3>
      <div className="w-full bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[#00000094]">
              <th className="p-3">Order Id</th>
              <th className="p-3">Items</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Placed</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length === 0 && (
              <tr>
                <td className="p-3" colSpan={6}>
                  No orders yet.
                </td>
              </tr>
            )}
            {orders &&
              orders.map((order) => (
                <tr className="border-b" key={order._id}>
                  <td className="p-3">#{order._id.slice(-8)}</td>
                  <td className="p-3">{order.cart.reduce((acc, item) => acc + item.qty, 0)}</td>
                  <td className="p-3">US$ {order.totalPrice}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-[13px] ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <Link to={`/dashboard-order/${order._id}`}>
                      <AiOutlineEye size={20} className="cursor-pointer" />
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllOrders;
