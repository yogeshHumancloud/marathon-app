import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productsList: [],
  selectedProduct: null,
};

export const counterSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
  },
});

export const { setSelectedProduct } = counterSlice.actions;

export default counterSlice.reducer;
