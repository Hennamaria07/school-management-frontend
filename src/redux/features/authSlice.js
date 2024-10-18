import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: sessionStorage.getItem('isAuthenticated') ? JSON.parse(sessionStorage.getItem('isAuthenticated')) : false,
    userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : null,
    token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            console.log(action.payload)
            const { isAuthenticated, userInfo, token } = action.payload;
            sessionStorage.setItem('isAuthenticated', isAuthenticated);
            sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
            sessionStorage.setItem('token', token);
            state.isAuthenticated = isAuthenticated;
            state.userInfo = userInfo;
            state.token = token;
        },
        logout: (state) => {
            sessionStorage.removeItem('isAuthenticated');
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('token');
            state.isAuthenticated = false;
            state.userInfo = null;
            state.token = null;
        }
    }
});

export const { signup, login, logout } = authSlice.actions;

export default authSlice.reducer;