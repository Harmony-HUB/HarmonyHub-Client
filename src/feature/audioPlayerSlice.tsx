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
});

const createSetter =
  (field: keyof AudioInstance) =>
  (
    state: AudioState,
    action: PayloadAction<{ audioPlayedId: number; [key: string]: any }>
  ) => {
    const { audioPlayedId, [field]: value } = action.payload;
    state.instances[audioPlayedId][field] = value;
    state.audioPlayedId = audioPlayedId;
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
    setAudioSource: createSetter("audioSource"),
    setStartTime: createSetter("startTime"),
    setPausedTime: createSetter("pausedTime"),
    setProgressPosition: createSetter("progressPosition"),
    setVolume: createSetter("volume"),
    setPitch: createSetter("pitch"),
    setTempo: createSetter("tempo"),
    setSelectedStart: createSetter("selectedStart"),
    setSelectedEnd: createSetter("selectedEnd"),
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
