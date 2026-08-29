import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// update shop info (name/description/address/phone/zip)
export const updateSellerInfo =
  (name, description, address, phoneNumber, zipCode) => async (dispatch) => {
    try {
      dispatch({ type: "updateSellerInfoRequest" });
      const { data } = await axios.put(
        `${BACKEND_URL}/api/shop/update-seller-info`,
        { name, description, address, phoneNumber, zipCode },
        { withCredentials: true }
      );
      dispatch({ type: "updateSellerInfoSuccess", payload: data.shop });
    } catch (error) {
      // rethrown so callers' .then() only fires on genuine success — otherwise a failed
      // save would show a success toast alongside the error one dispatched below
      dispatch({ type: "updateSellerInfoFailed", payload: error.response.data.message });
      throw error;
    }
  };

// update shop avatar — expects a FormData instance with a single "avatar" file
export const updateShopAvatar = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "updateShopAvatarRequest" });
    const { data } = await axios.put(`${BACKEND_URL}/api/shop/update-shop-avatar`, formData, {
      withCredentials: true,
    });
    dispatch({ type: "updateShopAvatarSuccess", payload: data.shop });
  } catch (error) {
    dispatch({ type: "updateShopAvatarFailed", payload: error.response.data.message });
    throw error;
  }
};

// set the shop's payout method
export const updatePaymentMethods = (withdrawMethod) => async (dispatch) => {
  try {
    dispatch({ type: "updatePaymentMethodsRequest" });
    const { data } = await axios.put(
      `${BACKEND_URL}/api/shop/update-payment-methods`,
      withdrawMethod,
      { withCredentials: true }
    );
    dispatch({ type: "updatePaymentMethodsSuccess", payload: data.shop });
  } catch (error) {
    dispatch({ type: "updatePaymentMethodsFailed", payload: error.response.data.message });
    throw error;
  }
};

// log out
export const logoutSeller = () => async (dispatch) => {
  try {
    await axios.post(`${BACKEND_URL}/api/shop/logout`, {}, { withCredentials: true });
    dispatch({ type: "LogoutSellerSuccess" });
  } catch (error) {
    dispatch({ type: "LogoutSellerFailed", payload: error.response.data.message });
    throw error;
  }
};

// all sellers, platform-wide --- admin
export const getAllSellersAdmin = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllSellersRequest" });
    const { data } = await axios.get(`${BACKEND_URL}/api/shop/admin-all-sellers`, {
      withCredentials: true,
    });
    dispatch({ type: "getAllSellersSuccess", payload: data.sellers });
  } catch (error) {
    dispatch({ type: "getAllSellersFailed", payload: error.response.data.message });
  }
};

// delete a seller --- admin
export const deleteSeller = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteSellerRequest" });
    await axios.delete(`${BACKEND_URL}/api/shop/delete-seller/${id}`, {
      withCredentials: true,
    });
    dispatch({ type: "deleteSellerSuccess", payload: id });
  } catch (error) {
    dispatch({ type: "deleteSellerFailed", payload: error.response.data.message });
    throw error;
  }
};

// remove the shop's payout method
export const deleteWithdrawMethod = () => async (dispatch) => {
  try {
    dispatch({ type: "deleteWithdrawMethodRequest" });
    const { data } = await axios.delete(`${BACKEND_URL}/api/shop/delete-withdraw-method`, {
      withCredentials: true,
    });
    dispatch({ type: "deleteWithdrawMethodSuccess", payload: data.shop });
  } catch (error) {
    dispatch({ type: "deleteWithdrawMethodFailed", payload: error.response.data.message });
    throw error;
  }
};
