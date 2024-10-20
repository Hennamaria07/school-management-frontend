import { ALL_FEES, CREATE_FEES, DELETE_FEES, SINGLE_FEES, UPDATE_FEES } from "@/lib/constants";
import { axiosInstance } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    studentFeesHistory: [],
    studentFees: {},
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

export const createFees = createAsyncThunk("fees/createFees", async (formData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(CREATE_FEES, formData, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})

export const getFeesById = createAsyncThunk("fees/getFeesById", async (id) => {
    try {
        const response = await axiosInstance.get(`${SINGLE_FEES}/${id}`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})

export const updateFees = createAsyncThunk("fees/updateFees", async ({ formData, id }) => {
    try {
        const response = await axiosInstance.put(`${UPDATE_FEES}/${id}`, formData, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})

export const deleteFees = createAsyncThunk("fees/deleteFees", async (id) => {
    try {
        const response = await axiosInstance.delete(`${DELETE_FEES}/${id}`, {
            withCredentials: true
        });
        return id;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})


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
            })
            .addCase(updateFees.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateFees.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.studentFees = action.payload;
            })
            .addCase(updateFees.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createFees.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createFees.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.studentFees = action.payload;
            })
            .addCase(createFees.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getFeesById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getFeesById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.studentFees = action.payload;
            })
            .addCase(getFeesById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteFees.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteFees.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.studentFees = state.studentFeesHistory.filter(
                    fees => fees._id !== action.payload
                );
                state.message = "Fees deleted successfully";
            })
            .addCase(deleteFees.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
    },
});

export default feesSlice.reducer;