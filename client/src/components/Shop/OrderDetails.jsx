import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import styles from "../../styles/styles";
import { getSellerOrders, updateOrderStatus } from "../../redux/actions/order";

// mirrors the seller-facing transitions the backend actually allows (server/controllers/orders/orderController.js)
const nextStatus = {
  Processing: "Shipped",
  Shipped: "Delivered",
};

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orders, isLoading, updateLoading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!orders) {
      dispatch(getSellerOrders());
    }
  }, [dispatch, orders]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
  }, [error]);

  const order = orders?.find((item) => item._id === id);

  if (isLoading || !orders) {
    return <div className="w-full p-8">Loading...</div>;
  }

  if (!order) {
    return <div className="w-full p-8">Order not found.</div>;
  }

  const advanceTo = nextStatus[order.status];

  // no explicit success toast here — a successful update re-renders this page with the
  // new status and a new "Mark as ..." target, which is its own confirmation; the error
  // effect above already covers the failure case.
  const handleAdvance = () => {
    dispatch(updateOrderStatus(order._id, advanceTo));
  };

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-[600] pb-4">Order #{order._id.slice(-8)}</h3>

      <div className="w-full bg-white shadow-sm rounded-md p-5 mb-6">
        <div className="flex justify-between pb-3 border-b">
          <h5 className="text-[16px] text-[#00000094]">Status</h5>
          <h5 className="font-[600]">{order.status}</h5>
        </div>
        {order.cart.map((item) => (
          <div className="flex items-center py-3 border-b" key={item.product}>
            <img
              src={item.images?.[0]?.url}
              alt=""
              className="w-[60px] h-[60px] rounded object-cover mr-4"
            />
            <div className="flex-1">
              <h5>{item.name}</h5>
              <p className="text-[#00000094]">
                ${item.discountPrice} x {item.qty}
              </p>
            </div>
            <h5 className="font-[600]">${(item.discountPrice * item.qty).toFixed(2)}</h5>
          </div>
        ))}
        <h5 className="text-end pt-3 font-[600]">Total: ${order.totalPrice}</h5>
      </div>

      <div className="w-full bg-white shadow-sm rounded-md p-5 mb-6">
        <h5 className="text-[16px] font-[600] pb-2">Shipping Address</h5>
        <p>
          {order.shippingAddress.address1}
          {order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ""}
        </p>
        <p>
          {order.shippingAddress.city}, {order.shippingAddress.country} - {order.shippingAddress.zipCode}
        </p>
      </div>

      {advanceTo && (
        <button
          onClick={handleAdvance}
          disabled={updateLoading}
          className={`${styles.button} !bg-[#f63b60] disabled:opacity-50`}
        >
          <h5 className="text-white">
            {updateLoading ? "Updating..." : `Mark as ${advanceTo}`}
          </h5>
        </button>
      )}
    </div>
  );
};

export default OrderDetails;
