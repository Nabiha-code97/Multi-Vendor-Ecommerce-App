import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// all orders placed by the logged-in user
export const getUserOrders = () => async (dispatch) => {
  try {
    dispatch({ type: "getUserOrdersRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/order/get-user-orders`, {
      withCredentials: true,
    });
    dispatch({ type: "getUserOrdersSuccess", payload: data.orders });
  } catch (error) {
    dispatch({ type: "getUserOrdersFailed", payload: error.response.data.message });
  }
};

// all orders belonging to the logged-in seller's shop
export const getSellerOrders = () => async (dispatch) => {
  try {
    dispatch({ type: "getSellerOrdersRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/order/get-seller-orders`, {
      withCredentials: true,
    });
    dispatch({ type: "getSellerOrdersSuccess", payload: data.orders });
  } catch (error) {
    dispatch({ type: "getSellerOrdersFailed", payload: error.response.data.message });
  }
};

// all orders, platform-wide --- admin
export const getAllOrdersAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllOrdersAdminRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/order/admin-all-orders`, {
      withCredentials: true,
    });
    dispatch({ type: "getAllOrdersAdminSuccess", payload: data.orders });
  } catch (error) {
    dispatch({ type: "getAllOrdersAdminFailed", payload: error.response.data.message });
  }
};

// seller moves an order Processing -> Shipped -> Delivered
export const updateOrderStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: "updateOrderStatusRequest" });
    const { data } = await axios.put(
      `${BACKEND_URL}/api/order/update-order-status/${id}`,
      { status },
      { withCredentials: true }
    );
    dispatch({ type: "updateOrderStatusSuccess", payload: data.order });
  } catch (error) {
    dispatch({ type: "updateOrderStatusFailed", payload: error.response.data.message });
  }
};
