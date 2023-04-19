import { createSlice } from "@reduxjs/toolkit";

const createAudioInstance = () => ({
  audioContext: null,
  audioBuffer: null,
  audioSource: null,
  startTime: 0,
  pausedTime: 0,
  progressPosition: 0,
  isPlaying: false,
  volume: 1,
  pitch: 1,
  tempo: 1,
});

const initialState = {
  instances: {},
  audioPlayedId: null,
  selectedStart: 0,
  selectedEnd: 1,
  draggedAudio: {
    id: null,
    audioBuffer: null,
    selectedStart: 0,
    selectedEnd: 1,
  },
};

const audioPlayerSlice = createSlice({
  name: "audioSlice",
  initialState,
  reducers: {
    setAudioContext: (state, action) => {
      const { audioPlayedId, audioContext } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].audioContext = audioContext;
      state.audioPlayedId = audioPlayedId;
    },
    setAudioBuffer: (state, action) => {
      const { audioPlayedId, audioBuffer } = action.payload;
      console.log("audioBufferReducer: ", audioPlayedId);
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].audioBuffer = audioBuffer;
      state.audioPlayedId = audioPlayedId;
    },
    setAudioSource: (state, action) => {
      const { audioPlayedId, audioSource } = action.payload;
      state.instances[audioPlayedId].audioSource = audioSource;
      state.audioPlayedId = audioPlayedId;
    },
    setStartTime: (state, action) => {
      const { audioPlayedId, startTime } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].startTime = startTime;
      state.audioPlayedId = audioPlayedId;
    },
    setPausedTime: (state, action) => {
      const { audioPlayedId, pausedTime } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].pausedTime = pausedTime;
      state.audioPlayedId = audioPlayedId;
    },
    setProgressPosition: (state, action) => {
      const { audioPlayedId, progressPosition } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].progressPosition = progressPosition;
      state.audioPlayedId = audioPlayedId;
    },
    setIsPlaying: (state, action) => {
      const { audioPlayedId, isPlaying } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].isPlaying = isPlaying;
      state.audioPlayedId = audioPlayedId;
    },
    setVolume: (state, action) => {
      const { audioPlayedId, volume } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].volume = volume;
      state.audioPlayedId = audioPlayedId;
    },
    setPitch: (state, action) => {
      const { audioPlayedId, pitch } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].pitch = pitch;
      state.audioPlayedId = audioPlayedId;
    },
    setTempo: (state, action) => {
      const { audioPlayedId, tempo } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].tempo = tempo;
      state.audioPlayedId = audioPlayedId;
    },
    setSelectedStart: (state, action) => {
      state.selectedStart = action.payload;
    },
    setSelectedEnd: (state, action) => {
      state.selectedEnd = action.payload;
    },
    setDraggedAudio: (state, action) => {
      state.draggedAudio = action.payload;
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
