import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import articleReducer from "@/features/articles/articleSlice";
import categoryReducer from "@/features/categories/categorySlice";
import tagReducer from "@/features/tags/tagSlice";
import commentReducer from "@/features/comments/commentSlice";
import bookmarkReducer from "@/features/bookmarks/bookmarkSlice";
import notificationReducer from "@/features/notifications/notificationSlice";
import analyticsReducer from "@/features/analytics/analyticsSlice";
import adminReducer from "@/features/admin/adminSlice";
import newsletterReducer from "@/features/newsletter/newsletterSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    articles: articleReducer,
    categories: categoryReducer,
    tags: tagReducer,
    comments: commentReducer,
    bookmarks: bookmarkReducer,
    notifications: notificationReducer,
    analytics: analyticsReducer,
    admin: adminReducer,
    newsletter: newsletterReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;
