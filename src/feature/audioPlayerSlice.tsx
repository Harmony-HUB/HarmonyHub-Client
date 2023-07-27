import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AudioInstance {
  audioBuffer: AudioBuffer | null;
  audioSource: AudioBufferSourceNode | null;
  startTime: number;
  pausedTime: number;
  progressPosition: number;
  volume: number;
  pitch: number;
  tempo: number;
  selectedStart: number;
  selectedEnd: number;
}

const createAudioInstance = (): AudioInstance => ({
  audioBuffer: null,
  audioSource: null,
  startTime: 0,
  pausedTime: 0,
  progressPosition: 0,
  volume: 1,
  pitch: 1,
  tempo: 1,
  selectedStart: 0,
  selectedEnd: 1,
});

interface AudioState {
  instances: Record<number, AudioInstance>;
  audioPlayedId: number | null;
}

const initialState: AudioState = {
  instances: {},
  audioPlayedId: null,
};

const audioPlayerSlice = createSlice({
  name: "audioSlice",
  initialState,
  reducers: {
    setAudioBuffer: (
      state,
      action: PayloadAction<{ audioPlayedId: number; audioBuffer: AudioBuffer }>
    ) => {
      const { audioPlayedId, audioBuffer } = action.payload;
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
      const { audioPlayedId, selectedStart } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].selectedStart = selectedStart;
      state.audioPlayedId = audioPlayedId;
    },
    setSelectedEnd: (state, action) => {
      const { audioPlayedId, selectedEnd } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].selectedEnd = selectedEnd;
      state.audioPlayedId = audioPlayedId;
    },
  },
});

export const {
  setAudioBuffer,
  setAudioSource,
  setStartTime,
  setPausedTime,
  setProgressPosition,
  setVolume,
  setPitch,
  setTempo,
  setSelectedStart,
  setSelectedEnd,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
