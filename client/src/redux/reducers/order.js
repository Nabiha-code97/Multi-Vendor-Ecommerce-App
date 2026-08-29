import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const orderReducer = createReducer(initialState, (builder) => {
  builder
    // get all orders placed by the logged-in user
    .addCase("getUserOrdersRequest", (state) => {
      state.userOrdersLoading = true;
    })
    .addCase("getUserOrdersSuccess", (state, action) => {
      state.userOrdersLoading = false;
      state.userOrders = action.payload;
    })
    .addCase("getUserOrdersFailed", (state, action) => {
      state.userOrdersLoading = false;
      state.error = action.payload;
    })

    // get all orders belonging to the seller's shop
    .addCase("getSellerOrdersRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("getSellerOrdersSuccess", (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    })
    .addCase("getSellerOrdersFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // seller updates one order's status
    .addCase("updateOrderStatusRequest", (state) => {
      state.updateLoading = true;
    })
    .addCase("updateOrderStatusSuccess", (state, action) => {
      state.updateLoading = false;
      const updated = action.payload;
      state.orders = (state.orders || []).map((order) =>
        order._id === updated._id ? updated : order
      );
    })
    .addCase("updateOrderStatusFailed", (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    })

    // all orders, platform-wide --- admin
    .addCase("getAllOrdersAdminRequest", (state) => {
      state.adminOrdersLoading = true;
    })
    .addCase("getAllOrdersAdminSuccess", (state, action) => {
      state.adminOrdersLoading = false;
      state.adminOrders = action.payload;
    })
    .addCase("getAllOrdersAdminFailed", (state, action) => {
      state.adminOrdersLoading = false;
      state.error = action.payload;
    })

    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});
