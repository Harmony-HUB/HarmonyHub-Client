import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import AudioContextWithGain from "../components/AudioPlayer/types";

interface AudioInstance {
  audioContext: AudioContextWithGain | null;
  audioBuffer: AudioBuffer | null;
  audioSource: AudioBufferSourceNode | null;
  startTime: number;
  pausedTime: number;
  progressPosition: number;
  isPlaying: boolean;
  volume: number;
  pitch: number;
  tempo: number;
  selectedStart: number;
  selectedEnd: number;
}

const createAudioInstance = (): AudioInstance => ({
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
    setAudioContext: (
      state,
      action: PayloadAction<{
        audioPlayedId: number;
        audioContext: AudioContextWithGain;
      }>
    ) => {
      const { audioPlayedId, audioContext } = action.payload;
      if (!state.instances[audioPlayedId]) {
        state.instances[audioPlayedId] = createAudioInstance();
      }
      state.instances[audioPlayedId].audioContext = audioContext;
      state.audioPlayedId = audioPlayedId;
    },
    setAudioBuffer: (state, action) => {
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
