import { Gain, PitchShift } from "tone";

export interface UserData {
  id: number;
  name: string;
  email: string;
}

export interface PropsId {
  audioPlayedId: number;
}

export interface AudioContextWithGain {
  context: AudioContext;
  gainNode: Gain;
  pitchShift: PitchShift;
}
