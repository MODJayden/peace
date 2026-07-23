import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/register", payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const loginUser = createAsyncThunk("auth/login", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/login", payload);
    localStorage.setItem("accessToken", data.data.accessToken);
    return data.data.user;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("accessToken");
    return true;
  } catch (error) {
    localStorage.removeItem("accessToken");
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/auth/me");
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/forgot-password", { email });
    return data.message;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/auth/reset-password", payload);
    return data.message;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const verifyEmail = createAsyncThunk("auth/verifyEmail", async ({ token, id }, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/auth/verify-email`, { params: { token, id } });
    return data.message;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateProfile = createAsyncThunk("auth/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.patch("/users/me", payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateAvatar = createAsyncThunk("auth/updateAvatar", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);
    const { data } = await api.patch("/users/me/avatar", formData);
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const initialState = {
  user: null,
  status: "idle", // idle | loading | succeeded | failed
  isBootstrapping: true,
  error: null,
  message: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthMessage(state) {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.message = "Registration successful. Please check your email to verify your account.";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.user = null;
      })

      .addCase(fetchCurrentUser.pending, (state) => {
        state.isBootstrapping = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isBootstrapping = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isBootstrapping = false;
      })

      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.message = action.payload;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.message = action.payload;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearAuthError, clearAuthMessage } = authSlice.actions;
export default authSlice.reducer;
