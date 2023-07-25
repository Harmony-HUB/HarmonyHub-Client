import { configureStore } from "@reduxjs/toolkit";
import audioPlayerReducer from "./feature/audioPlayerSlice";
import audioStatusReducer from "./feature/audioStatusSlice";

export const store = configureStore({
  reducer: {
    audioPlayer: audioPlayerReducer,
    audioStatus: audioStatusReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
