import { Gain, PitchShift } from "tone";

export interface UserData {
  email: string;
  name: string;
}

export interface PropsId {
  audioPlayedId: number;
}

export interface AudioContextWithGain {
  context: AudioContext;
  gainNode: Gain;
  pitchShift: PitchShift;
}
