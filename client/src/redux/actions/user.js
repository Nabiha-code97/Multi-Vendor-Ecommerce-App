import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_API_URL;

// load user
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadUserRequest",
    });
    const { data } = await axios.get(`${BACKEND_URL}/api/user/me`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadUserSuccess",
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: "LoadUserFail",
      payload: error.response.data.message,
    });
  }
};

// load seller
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: "LoadSellerRequest",
    });
    const { data } = await axios.get(`${BACKEND_URL}/api/shop/getSeller`, {
      withCredentials: true,
    });
    dispatch({
      type: "LoadSellerSuccess",
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: "LoadSellerFail",
      payload: error.response.data.message,
    });
  }
};

// update user information
// each action below rethrows after dispatching its Failed case — so a caller's
// .then(showSuccessToast) can only fire on genuine success, never alongside the error toast
export const updateUserInformation =
  (name, email, phoneNumber, password) => async (dispatch) => {
    try {
      dispatch({
        type: "updateUserInfoRequest",
      });

      const { data } = await axios.put(
        `${BACKEND_URL}/api/user/update-user-info`,
        { email, password, phoneNumber, name },
        { withCredentials: true }
      );

      dispatch({
        type: "updateUserInfoSuccess",
        payload: data.user,
      });
    } catch (error) {
      dispatch({
        type: "updateUserInfoFailed",
        payload: error.response.data.message,
      });
      throw error;
    }
  };

// update user avatar — expects a FormData instance with a single "avatar" file
export const updateUserAvatar = (formData) => async (dispatch) => {
  try {
    dispatch({ type: "updateUserAvatarRequest" });
    const { data } = await axios.put(`${BACKEND_URL}/api/user/update-avatar`, formData, {
      withCredentials: true,
    });
    dispatch({ type: "updateUserAvatarSuccess", payload: data.user });
  } catch (error) {
    dispatch({ type: "updateUserAvatarFailed", payload: error.response.data.message });
    throw error;
  }
};

// change password
export const updateUserPassword =
  (oldPassword, newPassword, confirmPassword) => async (dispatch) => {
    try {
      dispatch({ type: "updateUserPasswordRequest" });
      const { data } = await axios.put(
        `${BACKEND_URL}/api/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      dispatch({ type: "updateUserPasswordSuccess", payload: data.message });
    } catch (error) {
      dispatch({ type: "updateUserPasswordFailed", payload: error.response.data.message });
      throw error;
    }
  };

// log out
export const logoutUser = () => async (dispatch) => {
  try {
    await axios.post(`${BACKEND_URL}/api/user/logout`, {}, { withCredentials: true });
    dispatch({ type: "LogoutUserSuccess" });
  } catch (error) {
    dispatch({ type: "LogoutUserFailed", payload: error.response.data.message });
    throw error;
  }
};

// update user address
export const updatUserAddress =
  (country, city, address1, address2, zipCode, addressType) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "updateUserAddressRequest",
      });

      const { data } = await axios.put(
        `${BACKEND_URL}/api/user/update-user-addresses`,
        { country, city, address1, address2, zipCode, addressType },
        { withCredentials: true }
      );

      dispatch({
        type: "updateUserAddressSuccess",
        payload: {
          successMessage: "User address updated successfully!",
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: "updateUserAddressFailed",
        payload: error.response.data.message,
      });
      throw error;
    }
  };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteUserAddressRequest",
    });

    const { data } = await axios.delete(
      `${BACKEND_URL}/api/user/delete-user-address/${id}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteUserAddressSuccess",
      payload: {
        successMessage: "Address deleted successfully!",
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: "deleteUserAddressFailed",
      payload: error.response.data.message,
    });
    throw error;
  }
};

// delete a user --- admin
export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch({ type: "deleteUserRequest" });
    const { data } = await axios.delete(`${BACKEND_URL}/api/user/delete-user/${id}`, {
      withCredentials: true,
    });
    dispatch({ type: "deleteUserSuccess", payload: id });
    return data;
  } catch (error) {
    dispatch({ type: "deleteUserFailed", payload: error.response.data.message });
    throw error;
  }
};

// get all users --- admin
export const getAllUsers = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllUsersRequest",
    });

    const { data } = await axios.get(`${BACKEND_URL}/api/user/admin-all-users`, {
      withCredentials: true,
    });

    dispatch({
      type: "getAllUsersSuccess",
      payload: data.users,
    });
  } catch (error) {
    dispatch({
      type: "getAllUsersFailed",
      payload: error.response.data.message,
    });
  }
};
