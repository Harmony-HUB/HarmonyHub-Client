import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AudioContextWithGain } from "../types";

interface AudioContext {
  audioContext: AudioContextWithGain | null;
}

const initialState: AudioContext = {
  audioContext: null,
};

const audioContextSlice = createSlice({
  name: "audioContext",
  initialState,
  reducers: {
    setAudioContext: (
      state,
      action: PayloadAction<{ audioContext: AudioContextWithGain }>
    ) => {
      state.audioContext = action.payload.audioContext;
    },
  },
});

export const { setAudioContext } = audioContextSlice.actions;

export default audioContextSlice.reducer;
