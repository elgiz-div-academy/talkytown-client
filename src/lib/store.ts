import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./features/auth/auth.slice";
import { authApi } from "./features/auth/auth.api";
import { profileApi } from "./features/profile/profile.api";
import { postApi } from "./features/post/post.api";

export const makeStore = () => {
  let store = configureStore({
    reducer: {
      [authSlice.reducerPath]: authSlice.reducer,
      [authApi.reducerPath]: authApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [postApi.reducerPath]: postApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        authApi.middleware,
        profileApi.middleware,
        postApi.middleware
      ),
  });

  return store;
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
