import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const fetchAdminDashboard = createAsyncThunk("admin/dashboard", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/admin/dashboard");
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/admin/users", { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/admin/users/${id}/role`, { role });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const banUser = createAsyncThunk("admin/banUser", async ({ id, reason }, { rejectWithValue }) => {
  try {
    await api.post(`/admin/users/${id}/ban`, { reason });
    return id;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const unbanUser = createAsyncThunk("admin/unbanUser", async (id, { rejectWithValue }) => {
  try {
    await api.post(`/admin/users/${id}/unban`);
    return id;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchActivityLogs = createAsyncThunk(
  "admin/fetchActivityLogs",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/logs", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchSiteSettings = createAsyncThunk("admin/fetchSiteSettings", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/admin/settings");
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateSiteSettings = createAsyncThunk(
  "admin/updateSiteSettings",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.patch("/admin/settings", payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  dashboard: null,
  users: { results: [], pagination: null, status: "idle" },
  activityLogs: { results: [], pagination: null, status: "idle" },
  siteSettings: null,
  status: "idle",
  error: null,
};

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.dashboard = action.payload;
      })

      .addCase(fetchUsers.pending, (state) => {
        state.users.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.status = "succeeded";
        state.users.results = action.payload.results;
        state.users.pagination = action.payload.pagination;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.users.results = state.users.results.map((u) => (u._id === action.payload._id ? action.payload : u));
      })

      .addCase(banUser.fulfilled, (state, action) => {
        state.users.results = state.users.results.map((u) =>
          u._id === action.payload ? { ...u, isBanned: true } : u
        );
      })
      .addCase(unbanUser.fulfilled, (state, action) => {
        state.users.results = state.users.results.map((u) =>
          u._id === action.payload ? { ...u, isBanned: false } : u
        );
      })

      .addCase(fetchActivityLogs.pending, (state) => {
        state.activityLogs.status = "loading";
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.activityLogs.status = "succeeded";
        state.activityLogs.results = action.payload.results;
        state.activityLogs.pagination = action.payload.pagination;
      })

      .addCase(fetchSiteSettings.fulfilled, (state, action) => {
        state.siteSettings = action.payload;
      })
      .addCase(updateSiteSettings.fulfilled, (state, action) => {
        state.siteSettings = action.payload;
      });
  },
});

export default adminSlice.reducer;
