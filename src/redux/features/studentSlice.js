import { ALL_STUDENTS, CREATE_STUDENT, DELETE_STUDENT, UPDATE_STUDENT } from "@/lib/constants";
import { axiosInstance } from "@/lib/utils";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    students: [],
    student: {},
    isLoading: false,
    isError: false,
    isSuccess: false,
    message: "",
};

export const fetchStudents = createAsyncThunk("student/fetchStudents", async () => {
    try {
        const response = await axiosInstance.get(ALL_STUDENTS, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
});

export const updateStudent = createAsyncThunk("student/updateStudent", async ({ formData, id }) => {
    try {
        console.log(formData)
        const response = await axiosInstance.put(`${UPDATE_STUDENT}/${id}`, formData, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response?.data?.message || error.message;
    }
});

export const addStudent = createAsyncThunk("student/addStudent", async (data, { rejectWithValue }) => {
    try {
        const response = await axiosInstance.post(CREATE_STUDENT, data, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        // Enhanced error handling to capture specific error messages
        const errorMessage = error.response?.data?.message || error.message;
        return rejectWithValue(errorMessage);
    }
});

export const getStudentById = createAsyncThunk("student/getStudentById", async (id) => {
    try {
        const response = await axiosInstance.get(`${UPDATE_STUDENT}/${id}`, {
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        throw error.response.data.message || error.message;
    }
})

export const deleteStudent = createAsyncThunk(
    "student/deleteStudent", 
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`${DELETE_STUDENT}/${id}`, {
                withCredentials: true
            });
            return id; // Return the id for filtering from state
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || 
                "Failed to delete student"
            );
        }
    }
);

const studentSlice = createSlice({
    name: "student",
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.isSuccess = false;
            state.isError = false;
            state.message = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudents.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchStudents.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.students = action.payload;
            })
            .addCase(fetchStudents.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(updateStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(deleteStudent.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = "";
            })
            .addCase(deleteStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.students = state.students.filter(
                    student => student._id !== action.payload
                );
                state.message = "Student deleted successfully";
            })
            .addCase(deleteStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addStudent.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addStudent.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                state.message = "Student added successfully";
                if (action.payload && action.payload._id) {
                    state.students.push(action.payload);
                  }
            })
            .addCase(addStudent.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            })
            .addCase(getStudentById.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getStudentById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.student = action.payload;
            })
            .addCase(getStudentById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message;
            });
    },
});

export const { resetStatus } = studentSlice.actions;
export default studentSlice.reducer;