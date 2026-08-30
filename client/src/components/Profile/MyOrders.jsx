import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserOrders } from "../../redux/actions/order";

const statusColors = {
  "Pending Payment": "bg-gray-100 text-gray-600",
  "Payment Failed": "bg-red-100 text-red-600",
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  Delivered: "bg-green-100 text-green-700",
  "Refund Requested": "bg-orange-100 text-orange-700",
  Refunded: "bg-purple-100 text-purple-700",
};

const MyOrders = () => {
  const dispatch = useDispatch();
  const { userOrders, userOrdersLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (userOrdersLoading) {
    return <div className="w-full p-4">Loading...</div>;
  }

  return (
    <div className="w-full">
      <h3 className="text-[22px] font-[600] pb-4">My Orders</h3>
      {userOrders && userOrders.length === 0 && <p>You haven't placed any orders yet.</p>}
      {userOrders &&
        userOrders.map((order) => (
          <div className="w-full bg-white shadow-sm rounded-md p-5 mb-4" key={order._id}>
            <div className="flex justify-between items-center pb-3 border-b mb-3">
              <h5 className="font-[600]">Order #{order._id.slice(-8)}</h5>
              <span className={`px-2 py-1 rounded text-[13px] ${statusColors[order.status] || ""}`}>
                {order.status}
              </span>
            </div>
            {order.cart.map((item) => (
              <div className="flex items-center py-2" key={item.product}>
                <img
                  src={item.images?.[0]?.url}
                  alt=""
                  className="w-[50px] h-[50px] rounded object-cover mr-4"
                />
                <div className="flex-1">
                  <h5>{item.name}</h5>
                  <p className="text-[#00000094]">
                    ${item.discountPrice} x {item.qty}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t mt-2">
              <span className="text-[#00000094]">{new Date(order.createdAt).toLocaleDateString()}</span>
              <h5 className="font-[600]">Total: ${order.totalPrice}</h5>
            </div>
          </div>
        ))}
    </div>
  );
};

export default MyOrders;
