/* eslint-disable no-param-reassign */
import * as Tone from "tone";

export async function playSound(
  audioContext,
  audioBuffer,
  audioSource,
  setAudioSource,
  setIsPlaying,
  setStartTime,
  pausedTime,
  selectedStart
) {
  if (!audioContext || !audioContext.context || !audioBuffer || audioSource)
    return;

  if (audioContext.context.state === "suspended") {
    await audioContext.context.resume();
  }

  setIsPlaying(true);

  const newAudioSource = new Tone.GrainPlayer(audioBuffer, () => {
    setIsPlaying(false);
  });
  newAudioSource.connect(audioContext.pitchShift);
  audioContext.gainNode.connect(Tone.getContext().destination);
  newAudioSource.playbackRate = 1;
  newAudioSource.loop = false;

  const playbackOffset =
    pausedTime > 0 ? pausedTime : selectedStart * audioBuffer.duration;
  newAudioSource.start(0, playbackOffset);

  setAudioSource(newAudioSource);
  setStartTime(audioContext.context.currentTime);
}

export const pauseSound = (
  audioSource,
  setIsPlaying,
  setPausedTime,
  audioContext,
  startTime,
  pausedTime,
  setAudioSource
) => {
  if (!audioSource) return;

  setIsPlaying(false);

  audioSource.stop();
  setPausedTime(audioContext.context.currentTime - startTime + pausedTime);
  setAudioSource(null);
};

export const stopSound = (
  audioSource,
  setIsPlaying,
  setAudioSource,
  setPausedTime,
  setProgressPosition
) => {
  if (!audioSource) return;

  setIsPlaying(false);

  audioSource.stop();
  setAudioSource(null);
  setPausedTime(0);

  setProgressPosition(0);
};

export const handleVolumeChange = (
  event,
  setVolume,
  audioContext,
  setAudioContext
) => {
  const newVolume = event.target.value;
  setVolume(newVolume);

  if (audioContext && audioContext.gainNode) {
    const updatedAudioContext = {
      ...audioContext,
      gainNode: { ...audioContext.gainNode, gain: { value: newVolume } },
    };
    setAudioContext(updatedAudioContext);
  }
};

export const handlePitchChange = (delta, pitch, setPitch, audioContext) => {
  const newPitch = parseFloat(pitch + delta);
  if (newPitch < 0.5 || newPitch > 2) return;
  setPitch(newPitch);

  if (audioContext && audioContext.pitchShift) {
    audioContext.pitchShift.pitch = newPitch - 1;
  }
};

export const handleTempoChange = (delta, tempo, setTempo, audioSource) => {
  const newTempo = parseFloat(tempo + delta);
  if (newTempo < 0.5 || newTempo > 2) return;
  setTempo(newTempo);

  if (audioSource) {
    audioSource.playbackRate = newTempo;
  }
};
