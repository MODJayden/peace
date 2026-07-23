import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/api/axiosInstance";
import { extractErrorMessage } from "@/api/apiHelpers";

export const fetchArticles = createAsyncThunk("articles/fetchArticles", async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/articles", { params });
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchArticleBySlug = createAsyncThunk(
  "articles/fetchArticleBySlug",
  async (slug, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/articles/slug/${slug}`);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchBreakingNews = createAsyncThunk("articles/fetchBreakingNews", async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get("/articles/breaking");
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const fetchTrendingArticles = createAsyncThunk(
  "articles/fetchTrendingArticles",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/articles/trending", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchMyArticles = createAsyncThunk(
  "articles/fetchMyArticles",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/articles/me/mine", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const fetchReviewQueue = createAsyncThunk(
  "articles/fetchReviewQueue",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/articles/review/queue", { params });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const createArticle = createAsyncThunk("articles/createArticle", async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post("/articles", payload);
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const updateArticle = createAsyncThunk(
  "articles/updateArticle",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/articles/${id}`, payload);
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const deleteArticle = createAsyncThunk("articles/deleteArticle", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/articles/${id}`);
    return id;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const submitForReview = createAsyncThunk("articles/submitForReview", async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/articles/${id}/submit-review`);
    return data.data;
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const reviewArticle = createAsyncThunk(
  "articles/reviewArticle",
  async ({ id, decision, rejectionReason }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/articles/${id}/review`, { decision, rejectionReason });
      return data.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const uploadFeaturedImage = createAsyncThunk(
  "articles/uploadFeaturedImage",
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await api.post(`/articles/${id}/featured-image`, formData);
      return { id, featuredImage: data.data };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const toggleArticleLike = createAsyncThunk(
  "articles/toggleLike",
  async (articleId, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/likes/toggle", { targetType: "Article", targetId: articleId });
      return { articleId, liked: data.data.liked };
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  feed: { results: [], pagination: null, status: "idle" },
  breaking: [],
  trending: [],
  myArticles: { results: [], pagination: null, status: "idle" },
  reviewQueue: { results: [], pagination: null, status: "idle" },
  current: null,
  related: [],
  currentStatus: "idle",
  mutationStatus: "idle",
  error: null,
};

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {
    clearCurrentArticle(state) {
      state.current = null;
      state.related = [];
    },
    clearArticleError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.feed.status = "loading";
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.feed.status = "succeeded";
        state.feed.results = action.payload.results;
        state.feed.pagination = action.payload.pagination;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.feed.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchArticleBySlug.pending, (state) => {
        state.currentStatus = "loading";
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload.article;
        state.related = action.payload.related;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.error = action.payload;
      })

      .addCase(fetchBreakingNews.fulfilled, (state, action) => {
        state.breaking = action.payload;
      })
      .addCase(fetchTrendingArticles.fulfilled, (state, action) => {
        state.trending = action.payload;
      })

      .addCase(fetchMyArticles.pending, (state) => {
        state.myArticles.status = "loading";
      })
      .addCase(fetchMyArticles.fulfilled, (state, action) => {
        state.myArticles.status = "succeeded";
        state.myArticles.results = action.payload.results;
        state.myArticles.pagination = action.payload.pagination;
      })
      .addCase(fetchMyArticles.rejected, (state, action) => {
        state.myArticles.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchReviewQueue.pending, (state) => {
        state.reviewQueue.status = "loading";
      })
      .addCase(fetchReviewQueue.fulfilled, (state, action) => {
        state.reviewQueue.status = "succeeded";
        state.reviewQueue.results = action.payload.results;
        state.reviewQueue.pagination = action.payload.pagination;
      })

      .addCase(createArticle.pending, (state) => {
        state.mutationStatus = "loading";
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.mutationStatus = "succeeded";
        state.myArticles.results.unshift(action.payload);
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.mutationStatus = "failed";
        state.error = action.payload;
      })

      .addCase(updateArticle.fulfilled, (state, action) => {
        if (state.current?._id === action.payload._id) state.current = action.payload;
        state.myArticles.results = state.myArticles.results.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })

      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.myArticles.results = state.myArticles.results.filter((a) => a._id !== action.payload);
      })

      .addCase(submitForReview.fulfilled, (state, action) => {
        state.myArticles.results = state.myArticles.results.map((a) =>
          a._id === action.payload._id ? action.payload : a
        );
      })

      .addCase(reviewArticle.fulfilled, (state, action) => {
        state.reviewQueue.results = state.reviewQueue.results.filter((a) => a._id !== action.payload._id);
      })

      .addCase(toggleArticleLike.fulfilled, (state, action) => {
        const { articleId, liked } = action.payload;
        if (state.current?._id === articleId) {
          state.current.likeCount += liked ? 1 : -1;
          state.current.isLikedByMe = liked;
        }
      });
  },
});

export const { clearCurrentArticle, clearArticleError } = articleSlice.actions;
export default articleSlice.reducer;
