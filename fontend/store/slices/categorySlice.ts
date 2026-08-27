import { categoryService } from "@/lib/services/categoryService";
import { Category } from "@/types";
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected } from "@reduxjs/toolkit";

interface CategoryState {
    categories: Category[];
    currentCategories: Category | null;
    loading: boolean;
    error: string | null;
}

const initialState: CategoryState = {
    categories: [],
    currentCategories: null,
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

export const fetchCategoryById = createAsyncThunk("categoies/fetchCategoryById", async (id: number, { rejectWithValue }) => {
    try {
        const response = await categoryService.getById(id);
        return response;
    } catch (error: any) {
        rejectWithValue(error)
    }
})

const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
            })
            .addCase(fetchCategoryById.fulfilled, (state, action) => {
                state.currentCategories = action.payload;
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
