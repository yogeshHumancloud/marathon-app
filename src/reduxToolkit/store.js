import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./products/productSlice";
import cartSlice from "./cart/cartSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartSlice,
  },
});
