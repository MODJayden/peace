import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const fetchArticleComments = createAsyncThunk(
  "comments/fetchByArticle",
  async ({ articleId, params = {} }, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/comments/article/${articleId}`, { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchCommentReplies = createAsyncThunk(
  "comments/fetchReplies",
  async (commentId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/comments/${commentId}/replies`);
      return { commentId, replies: data.data };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const createComment = createAsyncThunk("comments/create", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/comments", payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const deleteComment = createAsyncThunk("comments/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/comments/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchModerationQueue = createAsyncThunk(
  "comments/moderationQueue",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/comments/moderation/queue", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const moderateComment = createAsyncThunk(
  "comments/moderate",
  async ({ id, decision }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/comments/${id}/moderate`, { decision });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  byArticle: { results: [], pagination: null, status: "idle" },
  repliesByComment: {},
  moderationQueue: { results: [], pagination: null, status: "idle" },
  mutationStatus: "idle",
  error: null,
};

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    clearComments(state) {
      state.byArticle = { results: [], pagination: null, status: "idle" };
      state.repliesByComment = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticleComments.pending, (state) => {
        state.byArticle.status = "loading";
      })
      .addCase(fetchArticleComments.fulfilled, (state, action) => {
        state.byArticle.status = "succeeded";
        state.byArticle.results = action.payload.results;
        state.byArticle.pagination = action.payload.pagination;
      })
      .addCase(fetchArticleComments.rejected, (state, action) => {
        state.byArticle.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchCommentReplies.fulfilled, (state, action) => {
        state.repliesByComment[action.payload.commentId] = action.payload.replies;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        if (!action.payload.parentComment) {
          state.byArticle.results.unshift(action.payload);
        } else {
          const parentId = action.payload.parentComment;
          state.repliesByComment[parentId] = [...(state.repliesByComment[parentId] || []), action.payload];
        }
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        state.byArticle.results = state.byArticle.results.filter((c) => c._id !== action.payload);
      })

      .addCase(fetchModerationQueue.pending, (state) => {
        state.moderationQueue.status = "loading";
      })
      .addCase(fetchModerationQueue.fulfilled, (state, action) => {
        state.moderationQueue.status = "succeeded";
        state.moderationQueue.results = action.payload.results;
        state.moderationQueue.pagination = action.payload.pagination;
      })

      .addCase(moderateComment.fulfilled, (state, action) => {
        state.moderationQueue.results = state.moderationQueue.results.filter((c) => c._id !== action.payload._id);
      });
  },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
