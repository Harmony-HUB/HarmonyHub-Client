import { createSlice } from "@reduxjs/toolkit";

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
  isTrimmed: boolean;
  isPlaying: boolean;
}

interface AudioState {
  instances: Record<number, AudioInstance>;
  audioPlayedId: number | null;
}

const initialState: AudioState = {
  instances: {},
  audioPlayedId: null,
};

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
  isTrimmed: false,
  isPlaying: false,
});

const setAudioValue = <K extends keyof AudioInstance>(
  state: AudioState,
  audioPlayedId: number,
  field: K,
  value: AudioInstance[K]
) => {
  if (!state.instances[audioPlayedId]) {
    state.instances[audioPlayedId] = createAudioInstance();
  }
  state.instances[audioPlayedId][field] = value;
  state.audioPlayedId = audioPlayedId;
};

const audioPlayerSlice = createSlice({
  name: "audioSlice",
  initialState,
  reducers: {
    setAudioBuffer: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "audioBuffer",
        action.payload.audioBuffer
      );
    },
    setAudioSource: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "audioSource",
        action.payload.audioSource
      );
    },
    setStartTime: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "startTime",
        action.payload.startTime
      );
    },
    setPausedTime: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "pausedTime",
        action.payload.pausedTime
      );
    },
    setProgressPosition: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "progressPosition",
        action.payload.progressPosition
      );
    },
    setVolume: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "volume",
        action.payload.volume
      );
    },
    setPitch: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "pitch",
        action.payload.pitch
      );
    },
    setTempo: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "tempo",
        action.payload.tempo
      );
    },
    setSelectedStart: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "selectedStart",
        action.payload.selectedStart
      );
    },
    setSelectedEnd: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "selectedEnd",
        action.payload.selectedEnd
      );
    },

    setIsTrimmed: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "isTrimmed",
        action.payload.isTrimmed
      );
    },

    setIsPlaying: (state, action) => {
      setAudioValue(
        state,
        action.payload.audioPlayedId,
        "isPlaying",
        action.payload.isPlaying
      );
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
  setIsPlaying,
  setIsTrimmed,
} = audioPlayerSlice.actions;

export default audioPlayerSlice.reducer;
