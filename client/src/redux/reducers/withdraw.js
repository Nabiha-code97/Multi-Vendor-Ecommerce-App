import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const withdrawReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("createWithdrawRequest", (state) => {
      state.createLoading = true;
    })
    .addCase("createWithdrawSuccess", (state, action) => {
      state.createLoading = false;
      state.withdraws = [action.payload, ...(state.withdraws || [])];
    })
    .addCase("createWithdrawFailed", (state, action) => {
      state.createLoading = false;
      state.error = action.payload;
    })

    .addCase("getSellerWithdrawsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getSellerWithdrawsSuccess", (state, action) => {
      state.isLoading = false;
      state.withdraws = action.payload;
    })
    .addCase("getSellerWithdrawsFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // all withdraw requests, platform-wide --- admin
    .addCase("getAllWithdrawsAdminRequest", (state) => {
      state.adminLoading = true;
    })
    .addCase("getAllWithdrawsAdminSuccess", (state, action) => {
      state.adminLoading = false;
      state.adminWithdraws = action.payload;
    })
    .addCase("getAllWithdrawsAdminFailed", (state, action) => {
      state.adminLoading = false;
      state.error = action.payload;
    })

    // admin approves/rejects a withdraw request
    .addCase("updateWithdrawStatusRequest", (state) => {
      state.updateLoading = true;
    })
    .addCase("updateWithdrawStatusSuccess", (state, action) => {
      state.updateLoading = false;
      const updated = action.payload;
      state.adminWithdraws = (state.adminWithdraws || []).map((withdraw) =>
        withdraw._id === updated._id ? updated : withdraw
      );
    })
    .addCase("updateWithdrawStatusFailed", (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
