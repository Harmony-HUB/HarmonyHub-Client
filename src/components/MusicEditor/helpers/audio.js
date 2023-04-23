import * as Tone from "tone";

const createAudioContextAndGainNode = () => {
  const audioContext = Tone.getContext();
  const gainNode = new Tone.Gain(1).toDestination();
  return { context: audioContext, gainNode };
};

export default createAudioContextAndGainNode;
