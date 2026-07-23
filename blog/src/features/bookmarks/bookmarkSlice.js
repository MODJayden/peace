import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const fetchMyBookmarks = createAsyncThunk(
  "bookmarks/fetchMine",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/bookmarks/mine", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const toggleBookmark = createAsyncThunk(
  "bookmarks/toggle",
  async ({ articleId, collectionName }, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/bookmarks/toggle", { articleId, collectionName });
      return { articleId, bookmarked: data.data.bookmarked };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  results: [],
  pagination: null,
  status: "idle",
  error: null,
};

const bookmarkSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyBookmarks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMyBookmarks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload.results;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMyBookmarks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(toggleBookmark.fulfilled, (state, action) => {
        if (!action.payload.bookmarked) {
          state.results = state.results.filter((b) => b.article._id !== action.payload.articleId);
        }
      });
  },
});

export default bookmarkSlice.reducer;
