//AuthSclie to store and reterive user Information and token in local Storage

import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { AppInfo } from "@/types";

const storedUser = localStorage.getItem('user');
const isaccess_token = localStorage.getItem('token');
const theme = localStorage.getItem("theme")
console.log("theme", theme)

const initialState: AppInfo = { 
user: storedUser ? JSON.parse(storedUser) : null,
token: isaccess_token ? JSON.parse(isaccess_token) : null,
theme: (theme === "dark" ? "dark" : "light")
};


export const authSlice = createSlice({
    initialState,
    name: 'auth',

    reducers: {
        setUserInfo: (state, action: PayloadAction<Omit<AppInfo, "theme">>) => {
            const {token, user} = action.payload
            state.user = user
            state.token = token;
            

            //always store data in console in the format of stringify and reterive data in the format of object(parse)
            localStorage.setItem("token", JSON.stringify(token));
            localStorage.setItem("user", JSON.stringify(user));

        },
        setUpdatedProfile: (state, action) => {
            const {user} = action.payload
            state.user = user
            localStorage.setItem("user", JSON.stringify(user))
        },
        removeUserInfo: (state) => {
            state.user = null
            state.token = null
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        setTheme: (state, action) => {
            state.theme = action.payload
            localStorage.setItem('theme', action.payload)
        }
    }
})

export const {setUserInfo,removeUserInfo, setUpdatedProfile, setTheme } = authSlice.actions
export default authSlice.reducer;