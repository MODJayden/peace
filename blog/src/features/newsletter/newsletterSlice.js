import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const subscribeNewsletter = createAsyncThunk(
  "newsletter/subscribe",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/newsletter/subscribe", payload);
      return data.message;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const unsubscribeNewsletter = createAsyncThunk(
  "newsletter/unsubscribe",
  async ({ email, token }, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/newsletter/unsubscribe", { params: { email, token } });
      return data.message;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  status: "idle",
  message: null,
  error: null,
};

const newsletterSlice = createSlice({
  name: "newsletter",
  initialState,
  reducers: {
    clearNewsletterState(state) {
      state.status = "idle";
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(subscribeNewsletter.pending, (state) => {
        state.status = "loading";
      })
      .addCase(subscribeNewsletter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      })
      .addCase(subscribeNewsletter.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(unsubscribeNewsletter.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.message = action.payload;
      });
  },
});

export const { clearNewsletterState } = newsletterSlice.actions;
export default newsletterSlice.reducer;
