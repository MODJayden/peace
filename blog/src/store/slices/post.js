import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { databases, ID, storage, Query } from "@/lib/appwrite";

// ============================================
// Async Thunks
// ============================================

const Url = `${import.meta.env.VITE_APPWRITE_IMAGE_BUCKET_ID}`;

/**
 * Fetches a single post by ID
 */
export const fetchPost = createAsyncThunk(
  "post/fetchPost",
  async (postId, { rejectWithValue }) => {
    try {
      const postDoc = await databases.getDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
        postId
      );
      return postDoc;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch post");
    }
  }
);

/**
 * Fetches all posts
 */
export const fetchPosts = createAsyncThunk(
  "post/fetchPosts",
  async (_, { rejectWithValue }) => {
    try {
      const posts = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID
      );
      return posts.documents;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch posts");
    }
  }
);

export const deleteImage = async (fileId) => {
  try {
    const bucketId = import.meta.env.VITE_APPWRITE_IMAGE_BUCKET_ID;
    await storage.deleteFile(bucketId, fileId);
    return true;
  } catch (error) {
    console.error("Delete failed:", error);
    throw error;
  }
};
/**
 * Fetches all posts by category
 */
export const fetchPostsByCategory = createAsyncThunk(
  "post/fetchPostsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const posts = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
        [],
        {
          limit: 100,
          offset: 0,
          filters: [
            {
              field: "category",
              operator: "=",
              value: categoryId,
            },
          ],
        }
      );
      return posts;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch posts");
    }
  }
);

export const uploadImage = createAsyncThunk(
  "post/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const bucketId = import.meta.env.VITE_APPWRITE_IMAGE_BUCKET_ID;

      // This returns a file object with $id property
      const response = await storage.createFile(bucketId, ID.unique(), file);

      // Return the file ID and construct the URL
      const fileUrl = `${
        import.meta.env.VITE_APPWRITE_ENDPOINT
      }/storage/buckets/${bucketId}/files/${response.$id}/view?project=${
        import.meta.env.VITE_APPWRITE_PROJECT_ID
      }`;

      return {
        fileId: response.$id,
        fileUrl: fileUrl,
      };
    } catch (error) {
      console.error("Upload error:", error);
      return rejectWithValue(error.message || "Failed to upload image");
    }
  }
);

export const previewImage = createAsyncThunk(
  "post/previewImage",
  async (imageId) => {
    try {
      const imageUrl = await storage.getFilePreview(Url, imageId);
      return imageUrl;
    } catch (error) {
      return error.message || "Failed to preview image";
    }
  }
);
export const fetchPostsByAuthor = createAsyncThunk(
  "post/fetchPostsByAuthor",
  async (authorId, { rejectWithValue }) => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
        [Query.equal("authorId", authorId)]
      );

      return response.documents;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch posts");
    }
  }
);

export const createPost = createAsyncThunk(
  "post/createPost",
  async (post, { rejectWithValue }) => {
    try {
      console.log(post);
      const postDoc = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
        ID.unique(),
        post
      );
      return postDoc;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create post");
    }
  }
);

export const updatePost = createAsyncThunk(
  "post/updatePost",
  async ({ postId, updates }, { rejectWithValue }) => {
    try {
      const postDoc = await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
        postId,
        updates
      );
      return postDoc;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update post");
    }
  }
);

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (postId, { rejectWithValue }) => {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
        postId
      );
      return postId;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete post");
    }
  }
);

// ============================================
// Slice
// ============================================

const initialState = {
  posts: [],
  isLoading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // ✅ These are for realtime updates (just update Redux state)
    addPost: (state, action) => {
      const exists = state.posts.some((p) => p.$id === action.payload.$id);
      if (!exists) {
        state.posts.unshift(action.payload);
        console.log("✅ Post added to state:", action.payload.$id);
      } else {
        console.log("⚠️ Post already exists:", action.payload.$id);
      }
    },
    updatePostInState: (state, action) => {
      const index = state.posts.findIndex((p) => p.$id === action.payload.$id);
      if (index !== -1) {
        state.posts[index] = action.payload;
        console.log("✅ Post updated in state:", action.payload.$id);
      }
    },
    removePost: (state, action) => {
      state.posts = state.posts.filter((p) => p.$id !== action.payload);
      console.log("✅ Post removed from state:", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch posts
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch posts by category
      .addCase(fetchPostsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch posts by author
      .addCase(fetchPostsByAuthor.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostsByAuthor.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPostsByAuthor.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Create post
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update post
      .addCase(updatePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Delete post
      .addCase(deletePost.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { addPost, updatePostInState, removePost } = postSlice.actions;
export default postSlice.reducer;
