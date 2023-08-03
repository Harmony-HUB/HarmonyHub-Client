import { createAsyncThunk } from "@reduxjs/toolkit";
import { GrainPlayer } from "tone";
import { setAudioBuffers } from "./musicEditorSlice";
import {
  setAudioBuffer,
  setSelectedEnd,
  setSelectedStart,
  setAudioSource,
  setStartTime,
  setPausedTime,
  setProgressPosition,
} from "./audioPlayerSlice";
import { setIsTrimmed, setIsPlaying } from "./audioStatusSlice";
import { RootState } from "../store";
import { PropsId } from "../types";

export const trimButtonThunk = createAsyncThunk(
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
  }
);

export const playButtonThunk = createAsyncThunk(
  "audioPlayer/playButton",
  async (payload: PropsId, { dispatch, getState }) => {
    const { audioPlayedId } = payload;

    const state = getState() as RootState;
    const {
      audioSource,
      audioBuffer,
      pausedTime,
      tempo,
      selectedStart,
      selectedEnd,
    } = state.audioPlayer.instances[payload.audioPlayedId] || {};

    const { audioContext } = state.audioContext;
    const { isTrimmed } = state.audioStatus.instances[audioPlayedId] || {};

    if (!audioContext || !audioContext.context || !audioBuffer || audioSource) {
      return;
    }

    if (audioContext.context.state === "suspended") {
      await audioContext.context.resume();
    }

    const newAudioSource = new GrainPlayer(audioBuffer, () => {
      dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));
    });

    newAudioSource.connect(audioContext.pitchShift);

    newAudioSource.playbackRate = tempo;
    newAudioSource.loop = false;

    const playbackOffset = isTrimmed
      ? Math.max(0, pausedTime)
      : Math.max(selectedStart * audioBuffer.duration, pausedTime);

    const duration = isTrimmed
      ? audioBuffer.duration - playbackOffset
      : (selectedEnd - selectedStart) * audioBuffer.duration - pausedTime;

    newAudioSource.start(0, playbackOffset, duration);

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: true }));
    dispatch(setAudioSource({ audioPlayedId, audioSource: newAudioSource }));
    dispatch(
      setStartTime({
        audioPlayedId,
        startTime: audioContext.context.currentTime,
      })
    );
  }
);

export const pauseButtonThunk = createAsyncThunk(
  "audioPlayer/pauseButton",
  async (payload: PropsId, { dispatch, getState }) => {
    const { audioPlayedId } = payload;
    const state = getState() as RootState;

    const { audioSource, startTime, pausedTime } =
      state.audioPlayer.instances[audioPlayedId] || {};

    const { audioContext } = state.audioContext;

    if (!audioSource) return;

    audioSource.stop();

    if (audioContext) {
      const elapsedTime = audioContext.context.currentTime - startTime;
      const newPausedTime = elapsedTime + pausedTime;

      dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));
      dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
      dispatch(setAudioSource({ audioPlayedId, audioSource: null }));
    }
  }
);

export const stopButtonThunk = createAsyncThunk(
  "audioPlayer/stopButton",
  async (payload: PropsId, { dispatch, getState }) => {
    const { audioPlayedId } = payload;
    const state = getState() as RootState;

    const { audioSource, selectedStart, audioBuffer } =
      state.audioPlayer.instances[audioPlayedId] || {};

    if (!audioSource) return;

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));

    audioSource.stop();
    dispatch(setAudioSource({ audioPlayedId, audioSource: null }));

    if (audioBuffer) {
      const newPausedTime = selectedStart * audioBuffer.duration;
      dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
    }

    dispatch(
      setProgressPosition({
        audioPlayedId,
        progressPosition: selectedStart * 100,
      })
    );
  }
);
