import { categoryService } from "@/lib/services/categoryService";
import { Category } from "@/types";
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";

interface CategoryState {
    data: Category[];
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    data: [],
    loading: false,
    error: null
}

export const fetchCategories = createAsyncThunk("categories/fetchCategories", async (_, { rejectWithValue }) => {
    try {
        const response = await categoryService.getAll();
        return response;
    } catch (error: any) {
        rejectWithValue(error);
    }
});

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.data = action.payload;
            })
            .addMatcher(isPending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addMatcher(isFulfilled, (state) => {
                state.loading = false;
            })
            .addMatcher(isRejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message as string;
            });
    },
});

export default categorySlice.reducer;
