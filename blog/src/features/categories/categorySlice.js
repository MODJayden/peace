import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const fetchCategories = createAsyncThunk("categories/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/categories");
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchCategoryBySlug = createAsyncThunk(
  "categories/fetchBySlug",
  async ({ slug, params = {} }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/categories/${slug}`, { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  list: [],
  status: "idle",
  current: null,
  currentArticles: { results: [], pagination: null },
  currentStatus: "idle",
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchCategoryBySlug.pending, (state) => {
        state.currentStatus = "loading";
      })
      .addCase(fetchCategoryBySlug.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload.category;
        state.currentArticles = { results: action.payload.results, pagination: action.payload.pagination };
      })
      .addCase(fetchCategoryBySlug.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
