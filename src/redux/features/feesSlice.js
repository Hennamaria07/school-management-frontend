import { ALL_FEES } from "@/lib/constants";
import { axiosInstance } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    studentFeesHistory: [],
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
};

export const fetchFees = createAsyncThunk("fees/fetchFees", async () => {
    try {
        const response = await axiosInstance.get(ALL_FEES, {
            withCredentials: true});
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
});


const feesSlice = createSlice({
    name: "fees",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFees.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchFees.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.studentFeesHistory = action.payload;
            })
            .addCase(fetchFees.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export default feesSlice.reducer;