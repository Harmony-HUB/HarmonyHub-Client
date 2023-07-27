import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface MusicEditor {
  audioFiles: {
    file: string;
    isUploaded: boolean;
  }[];
  combinedAudioBuffer: AudioBuffer | null;
}

const initialState: MusicEditor = {
  audioFiles: [],
  combinedAudioBuffer: null,
};

const musicEditorSlice = createSlice({
  name: "musicEditor",
  initialState,
  reducers: {
    setAudioFiles: (
      state,
      action: PayloadAction<MusicEditor["audioFiles"]>
    ) => {
      state.audioFiles = action.payload;
    },

    setCombinedAudioBuffer: (
      state,
      action: PayloadAction<MusicEditor["combinedAudioBuffer"]>
    ) => {
      state.combinedAudioBuffer = action.payload;
    },
  },
});

export const { setAudioFiles, setCombinedAudioBuffer } =
  musicEditorSlice.actions;

export default musicEditorSlice.reducer;
