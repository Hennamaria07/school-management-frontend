import { ALL_LIBRARY, CREATE_LIBRARY, DELETE_LIBRARY, SINGLE_LIBRARY, UPDATE_LIBRARY } from "@/lib/constants";
import { axiosInstance } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    librariesHistory: [],
    LibraryHistory: {},
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
};

export const fetchLibraries = createAsyncThunk(
    "library/fetchLibraries",
    async () => {
        try {
            const response = await axiosInstance.get(ALL_LIBRARY, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            throw error.response.data.message || error.message;
        }
    }
);

export const createLibraryHistory = createAsyncThunk(
    "library/createLibraryHistory",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(CREATE_LIBRARY, formData, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            throw error.response.data.message || error.message;
        }
    }
);

export const getLibraryHistroyById = createAsyncThunk(
    "library/getLibraryHistroryById",
    async (id) => {
        try {
            const response = await axiosInstance.get(`${SINGLE_LIBRARY}/${id}`, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            throw error.response.data.message || error.message;
        }
    }
);

export const updateLibraryHistory = createAsyncThunk(
    "library/updateLibraryHistory",
    async ({ formData, id }) => {
        try {
            const response = await axiosInstance.put(`${UPDATE_LIBRARY}/${id}`, formData, {
                withCredentials: true,
            });
            return response.data.data;
        } catch (error) {
            throw error?.response?.data?.message || error.message;
        }
    }
);

export const deleteLibraryHistory = createAsyncThunk(
    "library/deleteLibraryHistory",
    async (id) => {
        try {
            const response = await axiosInstance.delete(`${DELETE_LIBRARY}/${id}`, {
                withCredentials: true,
            });
            return id;
        } catch (error) {
            throw error.response.data.message || error.message;
        }
    }
);

const librarySlice = createSlice({
    name: "library",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLibraries.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLibraries.fulfilled, (state, action) => {
                state.isLoading = false;
                state.librariesHistory = action.payload;
            })
            .addCase(fetchLibraries.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(createLibraryHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createLibraryHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.LibraryHistory = action.payload;
            })
            .addCase(createLibraryHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(getLibraryHistroyById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLibraryHistroyById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.LibraryHistory = action.payload;
            })
            .addCase(getLibraryHistroyById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(updateLibraryHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateLibraryHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.LibraryHistory = action.payload;
            })
            .addCase(updateLibraryHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(deleteLibraryHistory.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteLibraryHistory.fulfilled, (state, action) => {
                state.isLoading = false;
                state.librariesHistory = state.librariesHistory.filter(
                    (library) => library._id !== action.payload
                );
            })
            .addCase(deleteLibraryHistory.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            });
    },
});

export default librarySlice.reducer;