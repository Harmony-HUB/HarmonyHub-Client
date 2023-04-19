import * as Tone from "tone";

const audioContext = new Tone.Context();
Tone.setContext(audioContext);

export default audioContext;
