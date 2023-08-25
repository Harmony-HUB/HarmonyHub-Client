import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RecorderState {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  audioSource: AudioBufferSourceNode | null;
  uploadedFile: string | null;
  recordedChunks: Blob[] | null;
  isRecored: boolean;
  stage: number;
  combinedAudioBuffer: AudioBuffer | null;
}

const initialState: RecorderState = {
  audioContext: null,
  audioBuffer: null,
  audioSource: null,
  uploadedFile: null,
  recordedChunks: null,
  isRecored: false,
  stage: 1,
  combinedAudioBuffer: null,
};

const createSetProperty =
  <K extends keyof RecorderState>(property: K) =>
  (state: RecorderState, action: PayloadAction<RecorderState[K]>) => {
    state[property] = action.payload;
  };

const audioRecorderSlice = createSlice({
  name: "recorder",
  initialState,
  reducers: {
    setAudioContext: createSetProperty("audioContext"),
    setAudioBuffer: createSetProperty("audioBuffer"),
    setAudioSource: createSetProperty("audioSource"),
    setUploadedFile: createSetProperty("uploadedFile"),
    setRecordedChunks: createSetProperty("recordedChunks"),
    setIsRecord: createSetProperty("isRecored"),
    setStage: createSetProperty("stage"),
  },
});

export const {
  setAudioContext,
  setAudioBuffer,
  setAudioSource,
  setUploadedFile,
  setRecordedChunks,
  setIsRecord,
  setStage,
} = audioRecorderSlice.actions;

export default audioRecorderSlice.reducer;
