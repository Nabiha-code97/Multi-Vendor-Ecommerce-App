import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// create a withdraw request
export const createWithdrawRequest = (amount) => async (dispatch) => {
  try {
    dispatch({ type: "createWithdrawRequest" });
    const { data } = await axios.post(
      `${BACKEND_URL}/api/withdraw/create-withdraw-request`,
      { amount },
      { withCredentials: true }
    );
    dispatch({ type: "createWithdrawSuccess", payload: data.withdraw });
  } catch (error) {
    dispatch({ type: "createWithdrawFailed", payload: error.response.data.message });
    throw error;
  }
};

// all withdraw requests belonging to the logged-in seller's shop
export const getSellerWithdraws = () => async (dispatch) => {
  try {
    dispatch({ type: "getSellerWithdrawsRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/withdraw/get-seller-withdraws`, {
      withCredentials: true,
    });
    dispatch({ type: "getSellerWithdrawsSuccess", payload: data.withdraws });
  } catch (error) {
    dispatch({ type: "getSellerWithdrawsFailed", payload: error.response.data.message });
  }
};

// all withdraw requests, platform-wide --- admin
export const getAllWithdrawsAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllWithdrawsAdminRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/withdraw/admin-all-withdraws`, {
      withCredentials: true,
    });
    dispatch({ type: "getAllWithdrawsAdminSuccess", payload: data.withdraws });
  } catch (error) {
    dispatch({ type: "getAllWithdrawsAdminFailed", payload: error.response.data.message });
  }
};

// admin approves or rejects a withdraw request
export const updateWithdrawStatus = (id, status) => async (dispatch) => {
  try {
    dispatch({ type: "updateWithdrawStatusRequest" });
    const { data } = await axios.put(
      `${BACKEND_URL}/api/withdraw/update-withdraw-status/${id}`,
      { status },
      { withCredentials: true }
    );
    dispatch({ type: "updateWithdrawStatusSuccess", payload: data.withdraw });
  } catch (error) {
    dispatch({ type: "updateWithdrawStatusFailed", payload: error.response.data.message });
    throw error;
  }
};
