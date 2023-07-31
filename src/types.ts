import { Gain, PitchShift } from "tone";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
}

export interface PropsId {
  audioPlayedId: number;
}

export interface AudioContextWithGain {
  context: AudioContext;
  gainNode: Gain;
  pitchShift: PitchShift;
}
