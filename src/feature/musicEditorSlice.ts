import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface MusicEditor {
  combinedAudioBuffer: AudioBuffer | null;
  audioBuffers: Array<AudioBuffer | null>;
}

const initialState: MusicEditor = {
  combinedAudioBuffer: null,
  audioBuffers: [],
};

const musicEditorSlice = createSlice({
  name: "musicEditor",
  initialState,
  reducers: {
    setCombinedAudioBuffer: (
      state,
      action: PayloadAction<MusicEditor["combinedAudioBuffer"]>
    ) => {
      state.combinedAudioBuffer = action.payload;
    },

    setAudioBuffers: (
      state,
      action: PayloadAction<MusicEditor["audioBuffers"]>
    ) => {
      state.audioBuffers = action.payload;
    },
  },
});

export const { setCombinedAudioBuffer, setAudioBuffers } =
  musicEditorSlice.actions;

export default musicEditorSlice.reducer;
