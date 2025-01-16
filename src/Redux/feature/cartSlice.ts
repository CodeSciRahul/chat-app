import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface receiver{
  _id: string | null,
  name: string | null,
  email: string | null,
  mobile: string | null;
}

const _id = sessionStorage.getItem("_id");
const name = sessionStorage.getItem("name")
const email = sessionStorage.getItem("email")
const mobile = sessionStorage.getItem("mobile");

const initialState: receiver = {
  _id: _id ? JSON.parse(_id) : null,
  name: name ? JSON.parse(name): null,
  email: email ? JSON.parse(email) : null,
  mobile: mobile ? JSON.parse(mobile) : null
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


      sessionStorage.setItem("_id", JSON.stringify(_id))
      sessionStorage.setItem("name", JSON.stringify(name))
      sessionStorage.setItem("email", JSON.stringify(email))
      sessionStorage.setItem("mobile", JSON.stringify(mobile))
    },
  },
});

export const { selectReciver} = receiverSlice.actions;

export default receiverSlice.reducer;
