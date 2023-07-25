import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AudioPlayerStatus {
  isTrimmed: boolean;
  isPlaying: boolean;
}

interface AudioState {
  instances: Record<number, AudioPlayerStatus>;
  audioPlayedId: number | null;
}

const initialState: AudioState = {
  instances: {},
  audioPlayedId: null,
};

const audioStatusSlice = createSlice({
  name: "audioStatusSlice",
  initialState,
  reducers: {
    setIsTrimmed: (
      state,
      action: PayloadAction<{
        audioPlayedId: number;
        isTrimmed: boolean;
      }>
    ) => {
      const { audioPlayedId, isTrimmed } = action.payload;

      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = { isTrimmed: false, isPlaying: false };
      }

      state.instances[audioPlayedId].isTrimmed = isTrimmed;
    },
  },
});

export const { setIsTrimmed } = audioStatusSlice.actions;

export default audioStatusSlice.reducer;
