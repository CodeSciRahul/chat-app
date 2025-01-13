import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./feature/authSlice";
import { receiverSlice } from "./feature/cartSlice";
export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        cart: receiverSlice.reducer
    },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
