import { ALL_LIBRARIANS, CREATE_LIBRARIAN, DELETE_LIBRARIAN, LIBRARIAN_PROFILE, UPDATE_LIBRARIAN } from "@/lib/constants";
import { axiosInstance } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
    librarians: [],
    librarian: {},
};

export const fetchLibrarians = createAsyncThunk("librarian/fetchLibrarians", async () => {
    try {
        const response = await axiosInstance.get(ALL_LIBRARIANS, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
});

export const createLibrarian = createAsyncThunk("librarian/createLibrarian", async (formData, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(CREATE_LIBRARIAN, formData, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        // Enhanced error handling to capture specific error messages
        const errorMessage = error.response?.data?.message || error.message;
        return rejectWithValue(errorMessage);
    }
})

export const updateLibrarian = createAsyncThunk("librarian/updateLibrarian", async ({ formData, id }) => {
    try {
        const response = await axiosInstance.put(`${UPDATE_LIBRARIAN}/${id}`, formData, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})

export const deleteLibrarian = createAsyncThunk("librarian/deleteLibrarian", async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`${DELETE_LIBRARIAN}/${id}`, {
        withCredentials: true
      });
      
      return id;
    } catch (error) {
      throw error.response.data.message || error.message;
    }
})

export const getLibrarianById = createAsyncThunk("librarian/getLibrarianById", async (id) => {
    try {
        const response = await axiosInstance.get(`${LIBRARIAN_PROFILE}/${id}`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})

const librarianSlice = createSlice({
    name: "librarian",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLibrarians.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchLibrarians.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.librarians = action.payload;
            })
            .addCase(fetchLibrarians.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(updateLibrarian.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateLibrarian.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.librarian = action.payload;
            })
            .addCase(updateLibrarian.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(deleteLibrarian.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteLibrarian.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.librarians = state.librarians.filter((librarian) => librarian._id !== action.payload);
            })
            .addCase(deleteLibrarian.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(getLibrarianById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getLibrarianById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.librarian = action.payload;
            })
            .addCase(getLibrarianById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(createLibrarian.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createLibrarian.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.librarian = action.payload;
            })
            .addCase(createLibrarian.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            });
    },
});

export default librarianSlice.reducer;