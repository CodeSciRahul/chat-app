import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReceiverState } from "@/types";

const _id = sessionStorage.getItem("_id");
const name = sessionStorage.getItem("name")
const email = sessionStorage.getItem("email")
const mobile = sessionStorage.getItem("mobile");

const initialState: ReceiverState = {
  _id: _id ? JSON.parse(_id) : null,
  name: name ? JSON.parse(name): null,
  email: email ? JSON.parse(email) : null,
  mobile: mobile ? JSON.parse(mobile) : null,
  selectionType: (sessionStorage.getItem("selectionType") ? JSON.parse(sessionStorage.getItem("selectionType") as string) : null)
};

export const receiverSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    selectReciver: (state, action: PayloadAction<ReceiverState>) => {
      const {_id, name, email, mobile, selectionType} = action?.payload
      state._id = _id,
      state.email = email,
      state.name = name
      state.mobile = mobile
      state.selectionType = selectionType ?? "user"


      sessionStorage.setItem("_id", JSON.stringify(_id))
      sessionStorage.setItem("name", JSON.stringify(name))
      sessionStorage.setItem("email", JSON.stringify(email))
      sessionStorage.setItem("mobile", JSON.stringify(mobile))
      sessionStorage.setItem("selectionType", JSON.stringify(selectionType ?? "user"))
    },
  },
});

export const { selectReciver} = receiverSlice.actions;

export default receiverSlice.reducer;
