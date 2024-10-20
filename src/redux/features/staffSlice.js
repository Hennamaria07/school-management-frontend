import { ALL_STAFF, CREATE_STAFF, DELETE_STAFF, STAFF_PROFILE, UPDATE_STAFF } from "@/lib/constants";
import { axiosInstance } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    staffs: [],
    staff: {},
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
};

export const fetchStaffs = createAsyncThunk("staff/fetchStaffs", async () => {
    try {
        const response = await axiosInstance.get(ALL_STAFF, {
            withCredentials: true});
        return response.data.data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
});

export const createStaff = createAsyncThunk(
    "staff/createStaff",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(CREATE_STAFF, formData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                error.message || 
                'An error occurred while creating staff'
            );
        }
    }
);
export const getStaffById = createAsyncThunk("staff/getStaffById", async (id) => {
    try {
        const response = await axiosInstance.get(`${STAFF_PROFILE}/${id}`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})

export const updateStaff = createAsyncThunk("staff/updateStaff", async ({ formData, id }) => {
    try {
        const response = await axiosInstance.put(`${UPDATE_STAFF}/${id}`, formData, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})

export const deleteStaff = createAsyncThunk("staff/deleteStaff", async (id) => {
    try {
        const response = await axiosInstance.delete(`${DELETE_STAFF}/${id}`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
});


const staffSlice = createSlice({
    name: "staff",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaffs.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStaffs.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.staffs = action.payload;
            })
            .addCase(fetchStaffs.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(createStaff.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createStaff.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(createStaff.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(deleteStaff.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteStaff.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(deleteStaff.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(getStaffById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStaffById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.staff = action.payload;
            })
            .addCase(getStaffById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(updateStaff.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateStaff.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.message = action.payload.message;
            })
            .addCase(updateStaff.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            });
    },
});

export default staffSlice.reducer;