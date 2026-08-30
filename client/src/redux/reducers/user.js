import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  // starts true: until loadUser() resolves we don't yet know if there's a session,
  // so route guards must wait rather than treating "not authenticated yet" as "not logged in"
  loading: true,
};

export const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("LoadUserSuccess", (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.user = action.payload;
    })
    .addCase("LoadUserFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    })

    // update user information
    .addCase("updateUserInfoRequest", (state) => {
      state.loading = true;
    })
    .addCase("updateUserInfoSuccess", (state, action) => {
      state.loading = false;
      state.user = action.payload;
    })
    .addCase("updateUserInfoFailed", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // update user avatar
    .addCase("updateUserAvatarRequest", (state) => {
      state.avatarLoading = true;
    })
    .addCase("updateUserAvatarSuccess", (state, action) => {
      state.avatarLoading = false;
      state.user = action.payload;
    })
    .addCase("updateUserAvatarFailed", (state, action) => {
      state.avatarLoading = false;
      state.error = action.payload;
    })

    // change password
    .addCase("updateUserPasswordRequest", (state) => {
      state.passwordLoading = true;
    })
    .addCase("updateUserPasswordSuccess", (state) => {
      state.passwordLoading = false;
    })
    .addCase("updateUserPasswordFailed", (state, action) => {
      state.passwordLoading = false;
      state.error = action.payload;
    })

    // log out
    .addCase("LogoutUserSuccess", (state) => {
      state.isAuthenticated = false;
      state.user = undefined;
    })
    .addCase("LogoutUserFailed", (state, action) => {
      state.error = action.payload;
    })

    // update user address
    .addCase("updateUserAddressRequest", (state) => {
      state.addressLoading = true;
    })
    .addCase("updateUserAddressSuccess", (state, action) => {
      state.addressLoading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    .addCase("updateUserAddressFailed", (state, action) => {
      state.addressLoading = false;
      state.error = action.payload;
    })

    // delete user address
    .addCase("deleteUserAddressRequest", (state) => {
      state.addressLoading = true;
    })
    .addCase("deleteUserAddressSuccess", (state, action) => {
      state.addressLoading = false;
      state.successMessage = action.payload.successMessage;
      state.user = action.payload.user;
    })
    .addCase("deleteUserAddressFailed", (state, action) => {
      state.addressLoading = false;
      state.error = action.payload;
    })

    // get all users --- admin
    .addCase("getAllUsersRequest", (state) => {
      state.usersLoading = true;
    })
    .addCase("getAllUsersSuccess", (state, action) => {
      state.usersLoading = false;
      state.users = action.payload;
    })
    .addCase("getAllUsersFailed", (state, action) => {
      state.usersLoading = false;
      state.error = action.payload;
    })

    // delete a user --- admin
    .addCase("deleteUserRequest", (state) => {
      state.usersLoading = true;
    })
    .addCase("deleteUserSuccess", (state, action) => {
      state.usersLoading = false;
      state.users = (state.users || []).filter((user) => user._id !== action.payload);
    })
    .addCase("deleteUserFailed", (state, action) => {
      state.usersLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    })
    .addCase("clearMessages", (state) => {
      state.successMessage = null;
    });
});
