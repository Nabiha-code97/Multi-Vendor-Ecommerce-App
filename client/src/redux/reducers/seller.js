import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isSeller: false,
  // starts true: until loadSeller() resolves we don't yet know if there's a session,
  // so route guards must wait rather than treating "not seller yet" as "not a seller"
  isLoading: true,
};

export const sellerReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("LoadSellerRequest", (state) => {
      state.isLoading = true;
    })
    .addCase("LoadSellerSuccess", (state, action) => {
      state.isSeller = true;
      state.isLoading = false;
      state.seller = action.payload;
    })
    .addCase("LoadSellerFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.isSeller = false;
    })
    .addCase("clearErrors", (state) => {
      state.error = null;
    })

    // log out
    .addCase("LogoutSellerSuccess", (state) => {
      state.isSeller = false;
      state.seller = undefined;
    })
    .addCase("LogoutSellerFailed", (state, action) => {
      state.error = action.payload;
    })

    // update shop info
    .addCase("updateSellerInfoRequest", (state) => {
      state.updateLoading = true;
    })
    .addCase("updateSellerInfoSuccess", (state, action) => {
      state.updateLoading = false;
      state.seller = action.payload;
    })
    .addCase("updateSellerInfoFailed", (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    })

    // update shop avatar
    .addCase("updateShopAvatarRequest", (state) => {
      state.updateLoading = true;
    })
    .addCase("updateShopAvatarSuccess", (state, action) => {
      state.updateLoading = false;
      state.seller = action.payload;
    })
    .addCase("updateShopAvatarFailed", (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    })

    // update payout method
    .addCase("updatePaymentMethodsRequest", (state) => {
      state.updateLoading = true;
    })
    .addCase("updatePaymentMethodsSuccess", (state, action) => {
      state.updateLoading = false;
      state.seller = action.payload;
    })
    .addCase("updatePaymentMethodsFailed", (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    })

    // remove payout method
    .addCase("deleteWithdrawMethodRequest", (state) => {
      state.updateLoading = true;
    })
    .addCase("deleteWithdrawMethodSuccess", (state, action) => {
      state.updateLoading = false;
      state.seller = action.payload;
    })
    .addCase("deleteWithdrawMethodFailed", (state, action) => {
      state.updateLoading = false;
      state.error = action.payload;
    })

    // all sellers, platform-wide --- admin
    .addCase("getAllSellersRequest", (state) => {
      state.sellersLoading = true;
    })
    .addCase("getAllSellersSuccess", (state, action) => {
      state.sellersLoading = false;
      state.sellers = action.payload;
    })
    .addCase("getAllSellersFailed", (state, action) => {
      state.sellersLoading = false;
      state.error = action.payload;
    })

    // delete a seller --- admin
    .addCase("deleteSellerRequest", (state) => {
      state.sellersLoading = true;
    })
    .addCase("deleteSellerSuccess", (state, action) => {
      state.sellersLoading = false;
      state.sellers = (state.sellers || []).filter((seller) => seller._id !== action.payload);
    })
    .addCase("deleteSellerFailed", (state, action) => {
      state.sellersLoading = false;
      state.error = action.payload;
    });
});
