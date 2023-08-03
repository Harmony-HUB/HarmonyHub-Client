import { createAsyncThunk } from "@reduxjs/toolkit";
import { setAudioBuffers } from "./musicEditorSlice";
import {
  setAudioBuffer,
  setSelectedEnd,
  setSelectedStart,
} from "./audioPlayerSlice";
import { setIsTrimmed } from "./audioStatusSlice";
import { RootState } from "../store";
import { PropsId } from "../types";

const trimButtonThunk = createAsyncThunk(
  "audioPlayer/trimButton",
  async (payload: PropsId, { dispatch, getState }) => {
    const { audioPlayedId } = payload;

    const state = getState() as RootState;
    const { audioBuffer, selectedStart, selectedEnd } =
      state.audioPlayer.instances[payload.audioPlayedId] || {};

    const { audioContext } = state.audioContext;
    const { audioBuffers } = state.musicEditor;

    const copyAudioChannelData = (
      oldBuffer: AudioBuffer,
      newBuffer: AudioBuffer,
      channel: number,
      startRatio: number,
      endRatio: number
    ) => {
      const oldChannelData = oldBuffer.getChannelData(channel);
      const newChannelData = newBuffer.getChannelData(channel);

      const startSample = Math.floor(startRatio * oldChannelData.length);
      const endSample = Math.floor(endRatio * oldChannelData.length);

      for (let i = startSample, j = 0; i < endSample; i += 1, j += 1) {
        newChannelData[j] = oldChannelData[i];
      }
    };

    const trimAudioBuffer = () => {
      if (!audioBuffer || audioBuffer.duration <= 1) return;

      if (!audioContext) return;
      const newBuffer = audioContext.context.createBuffer(
        audioBuffer.numberOfChannels,
        Math.floor((selectedEnd - selectedStart) * audioBuffer.length),
        audioBuffer.sampleRate
      );

      for (
        let channel = 0;
        channel < audioBuffer.numberOfChannels;
        channel += 1
      ) {
        copyAudioChannelData(
          audioBuffer,
          newBuffer,
          channel,
          selectedStart,
          selectedEnd
        );
      }

      const newAudioBuffers = [...audioBuffers];

      newAudioBuffers[audioPlayedId] = newBuffer;

      dispatch(setAudioBuffers(newAudioBuffers));
      dispatch(setAudioBuffer({ audioPlayedId, audioBuffer: newBuffer }));
      dispatch(setSelectedStart({ audioPlayedId, selectedStart: 0 }));
      dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: 1 }));
      dispatch(setIsTrimmed({ audioPlayedId, isTrimmed: true }));
    };

    trimAudioBuffer();
  }
);

export default trimButtonThunk;
