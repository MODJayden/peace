import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const fetchTags = createAsyncThunk("tags/fetchAll", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/tags", { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchTagBySlug = createAsyncThunk(
  "tags/fetchBySlug",
  async ({ slug, params = {} }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/tags/${slug}`, { params });
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

const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchTagBySlug.pending, (state) => {
        state.currentStatus = "loading";
      })
      .addCase(fetchTagBySlug.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload.tag;
        state.currentArticles = { results: action.payload.results, pagination: action.payload.pagination };
      })
      .addCase(fetchTagBySlug.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.error = action.payload;
      });
  },
});

export default tagSlice.reducer;
