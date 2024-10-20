import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice.js";
import studentReducer from "./features/studentSlice.js";
import staffReducer from "./features/staffSlice.js";
import feesReducer from "./features/feesSlice.js";
import librarianReducer from "./features/librarianSlice.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        student: studentReducer,
        staff: staffReducer,
        fees: feesReducer,
        librarian: librarianReducer
    },
});