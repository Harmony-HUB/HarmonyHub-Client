import { Gain, PitchShift } from "tone";

interface AudioContextWithGain {
  context: AudioContext;
  gainNode: Gain;
  pitchShift: PitchShift;
}

export default AudioContextWithGain;
