import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { account, databases } from "@/lib/appwrite";

export const loginWithGoogle = createAsyncThunk(
  "auth/loginWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      await account.createOAuth2Session(
        "google",
        `${window.location.origin}/#/auth/callback`,
        `${window.location.origin}/#/admin/login`
      );
    } catch (error) {
      console.error("[Auth] Google login error:", error);
      return rejectWithValue(
        error.message || "Failed to initiate Google login"
      );
    }
  }
);

export const getUser = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const appwriteUser = await account.get();
      return appwriteUser;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to get user");
    }
  }
);
export const checkAuthSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const appwriteUser = await account.get();

      // Fetch user document from database
      let userDoc;
      try {
        userDoc = await databases.getDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
          appwriteUser.$id
        );
      } catch (docError) {
        // User document doesn't exist - create new user with viewer role
        console.log("[Auth] No user document found, creating new user");
        const now = new Date().toISOString();

        try {
          userDoc = await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
            appwriteUser.$id,
            {
              username: appwriteUser.name || "User",
              email: appwriteUser.email,
              bio: "",
              role: "viewer", // Default role
              isActive: true,
              createdAt: now,
              updatedAt: now,
              ...(appwriteUser.prefs?.avatar && {
                avatarUrl: appwriteUser.prefs.avatar,
              }),
            }
          );
          console.log("[Auth] User document created successfully with viewer role");
        } catch (createError) {
          console.error("[Auth] Failed to create user document:", createError);
          await account.deleteSession("current");
          throw new Error("Failed to create user profile: " + createError.message);
        }
      }

      // Only allow admin role to access admin panel
      if (userDoc.role !== "admin") {
        await account.deleteSession("current");
        throw new Error("Unauthorized: Admin access only");
      }

      return {
        id: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
        ...userDoc,
      };
    } catch (error) {
      return rejectWithValue(error.message || "No active admin session");
    }
  }
);

export const handleOAuthCallback = createAsyncThunk(
  "auth/handleCallback",
  async (_, { rejectWithValue }) => {
    try {
      const appwriteUser = await account.get();

      if (!appwriteUser) {
        throw new Error("No authenticated user found");
      }

      console.log("[Auth] Login attempt:", appwriteUser.email);

      // Check if user exists in database
      let userDoc = null;
      try {
        userDoc = await databases.getDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
          appwriteUser.$id
        );
        console.log("[Auth] Existing user found in database");
      } catch (error) {
        // User doesn't exist - create new user with viewer role
        console.log("[Auth] User not found in database, creating new user");
        const now = new Date().toISOString();

        try {
          userDoc = await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
            appwriteUser.$id,
            {
              username: appwriteUser.name || "User",
              email: appwriteUser.email,
              bio: "",
              role: "viewer", // Default role
              isActive: true,
              createdAt: now,
              updatedAt: now,
              ...(appwriteUser.prefs?.avatar && {
                avatarUrl: appwriteUser.prefs.avatar,
              }),
            }
          );
          console.log("[Auth] User document created successfully with viewer role");
        } catch (createError) {
          console.error("[Auth] Failed to create user document:", createError);
          await account.deleteSession("current");
          throw new Error("Failed to create user profile: " + createError.message);
        }
      }

      // Verify admin role for admin panel access
      if (userDoc.role !== "admin") {
        await account.deleteSession("current");
        throw new Error("Unauthorized: Admin access only");
      }

      // Update last login time
      const now = new Date().toISOString();
      try {
        userDoc = await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
          appwriteUser.$id,
          {
            updatedAt: now,
            isActive: true,
          }
        );
      } catch (updateError) {
        console.warn("[Auth] Failed to update last login:", updateError);
      }

      console.log("[Auth] Admin authenticated successfully");

      return {
        id: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
        ...userDoc,
      };
    } catch (error) {
      console.error("[Auth] Authentication failed:", error);
      return rejectWithValue(error.message || "Failed to authenticate");
    }
  }
);

/* export const checkAuthSession = createAsyncThunk(
  "auth/checkSession",
  async (_, { rejectWithValue }) => {
    try {
      const appwriteUser = await account.get();

      // Fetch admin user document from database
      let userDoc;
      try {
        userDoc = await databases.getDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
          appwriteUser.$id
        );
      } catch (docError) {
        // User document doesn't exist - this is OK, just not logged in
        console.log("[Auth] No user document found, treating as logged out");
        throw new Error("No user document found");
      }

      // Only allow admin role
      if (userDoc.role !== "admin") {
        await account.deleteSession("current");
        throw new Error("Unauthorized: Admin access only");
      }

      return {
        id: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
        ...userDoc,
      };
    } catch (error) {
      // This is expected if user is not logged in - don't log as error
      return rejectWithValue(error.message || "No active admin session");
    }
  }
);

export const handleOAuthCallback = createAsyncThunk(
  "auth/handleCallback",
  async (_, { rejectWithValue }) => {
    try {
      const appwriteUser = await account.get();

      if (!appwriteUser) {
        throw new Error("No authenticated user found");
      }

      console.log("[Auth] Admin login attempt:", appwriteUser.email);

      // Whitelist of allowed ay
      // dmin emails
      const ALLOWED_ADMINS = [
        "darkolyrical@gmail.com",
        `liltrent999@gmail.com`,
        // Add more admin emails here as needed
      ];

      // Check if user exists in database
      let userDoc = null;
      try {
        userDoc = await databases.getDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
          appwriteUser.$id
        );
        console.log("[Auth] Existing user found in database");
      } catch (error) {
        // User doesn't exist - check if they're allowed to be admin
        console.log("[Auth] User not found in database");

        if (!ALLOWED_ADMINS.includes(appwriteUser.email)) {
          await account.deleteSession("current");
          throw new Error("Unauthorized: Only registered admins can login");
        }

        // Create new admin user
        console.log("[Auth] Creating new admin user document...");
        const now = new Date().toISOString();

        try {
          userDoc = await databases.createDocument(
            import.meta.env.VITE_APPWRITE_DATABASE_ID,
            import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
            appwriteUser.$id, // Important: Use Appwrite user ID as document ID
            {
              username: appwriteUser.name || "Admin User",
              email: appwriteUser.email,
              bio: "",
              role: "admin",
              isActive: true,
              createdAt: now,
              updatedAt: now,
              // Only add avatarUrl if it exists
              ...(appwriteUser.prefs?.avatar && {
                avatarUrl: appwriteUser.prefs.avatar,
              }),
            }
          );
          console.log("[Auth] Admin user document created successfully");
        } catch (createError) {
          console.error("[Auth] Failed to create user document:", createError);
          await account.deleteSession("current");
          throw new Error(
            "Failed to create admin profile: " + createError.message
          );
        }
      }

      // Verify admin role
      if (userDoc.role !== "admin") {
        await account.deleteSession("current");
        throw new Error("Unauthorized: Admin access only");
      }

      // Update last login time for admin
      const now = new Date().toISOString();
      try {
        userDoc = await databases.updateDocument(
          import.meta.env.VITE_APPWRITE_DATABASE_ID,
          import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
          appwriteUser.$id,
          {
            updatedAt: now,
            isActive: true,
          }
        );
      } catch (updateError) {
        console.warn("[Auth] Failed to update last login:", updateError);
        // Non-critical, continue with login
      }

      console.log("[Auth] Admin authenticated successfully");

      return {
        id: appwriteUser.$id,
        email: appwriteUser.email,
        name: appwriteUser.name,
        ...userDoc,
      };
    } catch (error) {
      console.error("[Auth] Admin authentication failed:", error);
      return rejectWithValue(error.message || "Failed to authenticate admin");
    }
  }
);
 */
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await account.deleteSession("current");
      console.log("[Auth] Admin logged out successfully");
    } catch (error) {
      console.error("[Auth] Logout error:", error);
      return rejectWithValue(error.message || "Failed to logout");
    }
  }
);

// ============================================
// Slice
// ============================================

const initialState = {
  admin: null,
  isAuthenticated: false,
  isLoading: false, // Don't block app startup
  isInitialized: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetAuth: (state) => {
      state.admin = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login with Google
      .addCase(loginWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Check auth session
      .addCase(checkAuthSession.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthSession.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(checkAuthSession.rejected, (state) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.admin = null;
        state.isAuthenticated = false;
      })

      // Handle OAuth callback
      .addCase(handleOAuthCallback.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(handleOAuthCallback.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.admin = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(handleOAuthCallback.rejected, (state, action) => {
        state.isLoading = false;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.admin = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.admin = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;

        state.admin = null;
      });
  },
});

export const { clearError, resetAuth } = authSlice.actions;
export default authSlice.reducer;

// ============================================
// Selectors
// ============================================
export const selectAuth = (state) => state.auth;
export const selectAdmin = (state) => state.auth.admin;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectError = (state) => state.auth.error;
