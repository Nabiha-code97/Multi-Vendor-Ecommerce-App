import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// create a coupon
export const createCoupon = (couponData) => async (dispatch) => {
  try {
    dispatch({ type: "createCouponRequest" });
    const { data } = await axios.post(`${BACKEND_URL}/api/coupon/create-coupon`, couponData, {
      withCredentials: true,
    });
    dispatch({ type: "createCouponSuccess", payload: data.coupon });
  } catch (error) {
    dispatch({ type: "createCouponFailed", payload: error.response.data.message });
    throw error;
  }
};

// all coupons belonging to the logged-in seller's shop
export const getSellerCoupons = () => async (dispatch) => {
  try {
    dispatch({ type: "getSellerCouponsRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/coupon/get-seller-coupons`, {
      withCredentials: true,
    });
    dispatch({ type: "getSellerCouponsSuccess", payload: data.coupons });
  } catch (error) {
    dispatch({ type: "getSellerCouponsFailed", payload: error.response.data.message });
  }
};

// delete a coupon
export const deleteCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteCouponRequest" });
    const { data } = await axios.delete(`${BACKEND_URL}/api/coupon/delete-coupon/${id}`, {
      withCredentials: true,
    });
    dispatch({ type: "deleteCouponSuccess", payload: id });
    return data;
  } catch (error) {
    dispatch({ type: "deleteCouponFailed", payload: error.response.data.message });
    throw error;
  }
};
