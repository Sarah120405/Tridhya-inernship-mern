import { createSlice } from "@reduxjs/toolkit";

const checkoutSlice = createSlice({
  name: "checkoutSlice",
  initialState: {
    name: "",
    address: "",
    paymentMethod: "",
  },
  reducers: {
    updateField: (state, action) => {
      // action.payload will be { field: "name", value: "Sarah" }
      // update state[action.payload.field] = action.payload.value
      state[action.payload.field] = action.payload.value;
    },
    resetCheckout: (state) => {
      state.name = "";
      state.address = "";
      state.paymentMethod = "";
    },
  },
});

export const { updateField, resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;
