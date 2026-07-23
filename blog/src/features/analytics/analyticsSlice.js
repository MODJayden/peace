import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const trackAnalyticsEvent = createAsyncThunk(
  "analytics/track",
  async (payload, { rejectWithValue }) => {
    try {
      await api.post("/analytics/track", payload);
      return true;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchOverviewAnalytics = createAsyncThunk(
  "analytics/overview",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/overview", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchPopularArticles = createAsyncThunk(
  "analytics/popularArticles",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/popular-articles", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchTopCategories = createAsyncThunk(
  "analytics/topCategories",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/top-categories", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchTopAuthors = createAsyncThunk(
  "analytics/topAuthors",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/top-authors", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchAuthorAnalytics = createAsyncThunk(
  "analytics/authorAnalytics",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/author/me", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchRevenueDashboard = createAsyncThunk(
  "analytics/revenue",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/analytics/revenue", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  overview: null,
  popularArticles: [],
  topCategories: [],
  topAuthors: [],
  authorAnalytics: null,
  revenue: null,
  status: "idle",
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOverviewAnalytics.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOverviewAnalytics.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.overview = action.payload;
      })
      .addCase(fetchOverviewAnalytics.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchPopularArticles.fulfilled, (state, action) => {
        state.popularArticles = action.payload;
      })
      .addCase(fetchTopCategories.fulfilled, (state, action) => {
        state.topCategories = action.payload;
      })
      .addCase(fetchTopAuthors.fulfilled, (state, action) => {
        state.topAuthors = action.payload;
      })
      .addCase(fetchAuthorAnalytics.fulfilled, (state, action) => {
        state.authorAnalytics = action.payload;
      })
      .addCase(fetchRevenueDashboard.fulfilled, (state, action) => {
        state.revenue = action.payload;
      });
  },
});

export default analyticsSlice.reducer;
