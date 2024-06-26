import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import cubeReducer from "./features/cubeSlice";

export const store = configureStore({
  reducer: {
    cube: cubeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

type RootState = ReturnType<typeof store.getState>;
export const useCubeDispatch = () => useDispatch<typeof store.dispatch>();
export const useCubeSelector: TypedUseSelectorHook<RootState> = useSelector;
