import { configureStore } from "@reduxjs/toolkit";
import audioPlayerReducer from "./feature/audioPlayerSlice";
import audioContextSlice from "./feature/audioContextSlice";
import musicEditorSlice from "./feature/musicEditorSlice";
import audioRecorderSlice from "./feature/recorderSlice";
import audioStorageSlice from "./feature/audioStorageSlice";
import userDataSlice from "./feature/userDataSlice";

export const store = configureStore({
  reducer: {
    audioPlayer: audioPlayerReducer,
    musicEditor: musicEditorSlice,
    audioContext: audioContextSlice,
    audioRecorder: audioRecorderSlice,
    audioStorage: audioStorageSlice,
    userData: userDataSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
