import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  audioContext: {
    context: null,
    gainNode: null,
    pitchShift: null,
  },
  audioBuffer: null,
  audioSource: null,
  startTime: 0,
  pausedTime: 0,
  progressPosition: 0,
  isPlaying: false,
  volume: 1,
  pitch: 1,
  tempo: 1,
  selectedStart: 0,
  selectedEnd: 1,
};

const audioPlayerSlice = createSlice({
  name: "audioSlice",
  initialState,
  reducers: {
    setAudioContext: (state, action) => {
      state.audioContext = action.payload;
    },
    setAudioBuffer: (state, action) => {
      state.audioBuffer = action.payload;
    },
    setAudioSource: (state, action) => {
      state.audioSource = action.payload;
    },
    setStartTime: (state, action) => {
      state.startTime = action.payload;
    },
    setPausedTime: (state, action) => {
      state.pausedTime = action.payload;
    },
    setProgressPosition: (state, action) => {
      state.progressPosition = action.payload;
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
    },
    setPitch: (state, action) => {
      state.pitch = action.payload;
    },
    setTempo: (state, action) => {
      state.tempo = action.payload;
    },
    setSelectedStart: (state, action) => {
      state.selectedStart = action.payload;
    },
    setSelectedEnd: (state, action) => {
      state.selectedEnd = action.payload;
    },
  },
});

export const {
  setAudioContext,
  setAudioBuffer,
  setAudioSource,
  setStartTime,
  setPausedTime,
  setProgressPosition,
  setIsPlaying,
  setVolume,
  setPitch,
  setTempo,
  setSelectedStart,
  setSelectedEnd,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
