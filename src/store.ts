import { configureStore } from "@reduxjs/toolkit";
import audioPlayerReducer from "./feature/audioPlayerSlice";
import audioStatusReducer from "./feature/audioStatusSlice";
import audioContextSlice from "./feature/audioContextSlice";
import musicEditorSlice from "./feature/musicEditorSlice";

export const store = configureStore({
  reducer: {
    audioPlayer: audioPlayerReducer,
    audioStatus: audioStatusReducer,
    musicEditor: musicEditorSlice,
    audioContext: audioContextSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
