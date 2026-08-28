import { createReducer } from "@reduxjs/toolkit";

const storedWishlist = localStorage.getItem("wishlistItems");
 
const initialState = {
  wishlist: storedWishlist ? JSON.parse(storedWishlist) : [],
};


export const wishlistReducer = createReducer(initialState, (builder) => {
  builder
    .addCase("addToWishlist", (state, action) => {
      const item = action.payload;
      const existingItem = state.wishlist.find((i) => i._id === item._id);
 
      if (existingItem) {
        state.wishlist = state.wishlist.map((i) =>
          i._id === existingItem._id ? item : i
        );
      } else {
        state.wishlist.push(item);
      }
    })
    .addCase("removeFromWishlist", (state, action) => {
      state.wishlist = state.wishlist.filter(
        (i) => i._id !== action.payload
      );
    });
});