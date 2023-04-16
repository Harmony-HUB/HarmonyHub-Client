import { configureStore } from "@reduxjs/toolkit";
import audioPlayerReducer from "./feature/audioPlayerSlice";

export default configureStore({
  reducer: {
    audioPlayer: audioPlayerReducer,
  },
});
