import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const couponReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("createCouponRequest", (state) => {
      state.createLoading = true;
    })
    .addCase("createCouponSuccess", (state, action) => {
      state.createLoading = false;
      state.coupons = [action.payload, ...(state.coupons || [])];
    })
    .addCase("createCouponFailed", (state, action) => {
      state.createLoading = false;
      state.error = action.payload;
    })

    .addCase("getSellerCouponsRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getSellerCouponsSuccess", (state, action) => {
      state.isLoading = false;
      state.coupons = action.payload;
    })
    .addCase("getSellerCouponsFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    .addCase("deleteCouponRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("deleteCouponSuccess", (state, action) => {
      state.isLoading = false;
      state.coupons = (state.coupons || []).filter((coupon) => coupon._id !== action.payload);
    })
    .addCase("deleteCouponFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
