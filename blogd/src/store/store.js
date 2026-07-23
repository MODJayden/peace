import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/authSlice";
import postReducer from "./slices/post";

const store = configureStore({
  reducer: {
    auth: userReducer,
    post: postReducer,
  },
});

export default store;
