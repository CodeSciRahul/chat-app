//CartSLice to add menuItem on Cart 

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface receiver{
  _id: string | null,
  name: string | null,
  email: string | null,
  mobile: string | null;
}

const initialState: receiver = {
  _id: null,
  name: null,
  email: null,
  mobile: null
};

export const receiverSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    selectReciver: (state, action: PayloadAction<receiver>) => {
      const {_id, name, email, mobile} = action?.payload
      state._id = _id,
      state.email = email,
      state.name = name
      state.mobile = mobile
    },
  },
});

export const { selectReciver} = receiverSlice.actions;

export default receiverSlice.reducer;
