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

const audioRecorderSlice = createSlice({
  name: "recorder",
  initialState,
  reducers: {
    setAudioContext: (
      state,
      action: PayloadAction<RecorderState["audioContext"]>
    ) => {
      state.audioContext = action.payload;
    },
    setAudioBuffer: (
      state,
      action: PayloadAction<RecorderState["audioBuffer"]>
    ) => {
      state.audioBuffer = action.payload;
    },
    setAudioSource: (
      state,
      action: PayloadAction<RecorderState["audioSource"]>
    ) => {
      state.audioSource = action.payload;
    },
    setUploadedFile: (
      state,
      action: PayloadAction<RecorderState["uploadedFile"]>
    ) => {
      state.uploadedFile = action.payload;
    },
    setRecordedChunks: (
      state,
      action: PayloadAction<RecorderState["recordedChunks"]>
    ) => {
      state.recordedChunks = action.payload;
    },
    setIsRecord: (state, action: PayloadAction<RecorderState["isRecored"]>) => {
      state.isRecored = action.payload;
    },
    setStage: (state, action: PayloadAction<RecorderState["stage"]>) => {
      state.stage = action.payload;
    },
    setCombinedAudioBuffer: (
      state,
      action: PayloadAction<RecorderState["combinedAudioBuffer"]>
    ) => {
      state.combinedAudioBuffer = action.payload;
    },
  },
});

export const {
  setAudioContext,
  setUploadedFile,
  setAudioBuffer,
  setAudioSource,
  setRecordedChunks,
  setIsRecord,
  setStage,
  setCombinedAudioBuffer,
} = audioRecorderSlice.actions;

export default audioRecorderSlice.reducer;
