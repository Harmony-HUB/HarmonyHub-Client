// /* eslint-disable no-param-reassign */
// export const updateProgress = (
//   audioBuffer,
//   audioContext,
//   isPlaying,
//   startTime,
//   pausedTime,
//   audioPlayedId,
//   setProgressPosition,
//   dispatch
// ) => {
//   if (!audioContext || !audioBuffer || !isPlaying) return;

//   const currentTime = audioContext.context.currentTime - startTime + pausedTime;
//   const progress = (currentTime / audioBuffer.duration) * 100;
//   dispatch(setProgressPosition({ audioPlayedId, progressPosition: progress }));
// };

// export const playSound = async (
//   audioContext,
//   audioBuffer,
//   audioSource,
//   dispatch,
//   setIsPlaying,
//   audioPlayedId,
//   pausedTime,
//   selectedEnd,
//   selectedStart,
//   isTrimmed,
//   Tone,
//   setAudioSource,
//   setStartTime,
//   fadeOut,
//   fadeIn
// ) => {
//   if (!audioContext || !audioContext.context || !audioBuffer || audioSource)
//     return;

//   if (audioContext.context.state === "suspended") {
//     await audioContext.context.resume();
//   }

//   dispatch(setIsPlaying({ audioPlayedId, isPlaying: true }));

//   const newAudioSource = new Tone.GrainPlayer(audioBuffer, () => {
//     dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));
//   });
//   newAudioSource.connect(audioContext.pitchShift);
//   audioContext.gainNode.connect(audioContext.context.destination);
//   newAudioSource.playbackRate = 1;
//   newAudioSource.loop = false;

//   const playbackOffset = isTrimmed
//     ? Math.max(0, pausedTime)
//     : Math.max(selectedStart * audioBuffer.duration, pausedTime);

//   const duration = isTrimmed
//     ? audioBuffer.duration - playbackOffset
//     : (selectedEnd - selectedStart) * audioBuffer.duration - pausedTime;

//   newAudioSource.start(0, playbackOffset, duration);

//   if (fadeIn > 0) {
//     newAudioSource.volume.setValueAtTime(-Infinity, playbackOffset);
//     newAudioSource.volume.linearRampToValueAtTime(
//       0,
//       playbackOffset + fadeIn + duration
//     );
//   }

//   if (fadeOut > 0) {
//     newAudioSource.volume.setValueAtTime(0, playbackOffset + duration);
//     newAudioSource.volume.linearRampToValueAtTime(
//       -Infinity,
//       playbackOffset + duration - fadeOut * duration
//     );
//   }

//   dispatch(setAudioSource({ audioPlayedId, audioSource: newAudioSource }));
//   dispatch(
//     setStartTime({
//       audioPlayedId,
//       startTime: audioContext.context.currentTime,
//     })
//   );
// };

// export const pauseSound = (
//   audioSource,
//   dispatch,
//   setIsPlaying,
//   audioPlayedId,
//   audioContext,
//   startTime,
//   pausedTime,
//   setPausedTime,
//   setAudioSource
// ) => {
//   if (!audioSource) return;

//   dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));

//   audioSource.stop();
//   const elapsedTime = audioContext.context.currentTime - startTime;
//   const newPausedTime = elapsedTime + pausedTime;

//   dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
//   dispatch(setAudioSource({ audioPlayedId, audioSource: null }));
// };

// export const stopSound = (
//   audioSource,
//   dispatch,
//   setIsPlaying,
//   audioPlayedId,
//   setAudioSource,
//   setPausedTime,
//   setProgressPosition,
//   selectedStart
// ) => {
//   if (!audioSource) return;

//   dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));

//   audioSource.stop();
//   dispatch(setAudioSource({ audioPlayedId, audioSource: null }));
//   dispatch(setPausedTime({ audioPlayedId, pausedTime: 0 }));

//   dispatch(
//     setProgressPosition({
//       audioPlayedId,
//       progressPosition: selectedStart * 100,
//     })
//   );
// };

// export const handleVolumeChange = (
//   event,
//   dispatch,
//   setVolume,
//   audioPlayedId,
//   audioContext
// ) => {
//   const newVolume = event.target.value;
//   dispatch(setVolume({ audioPlayedId, volume: newVolume }));

//   if (audioContext && audioContext.gainNode) {
//     audioContext.gainNode.gain.value = newVolume;
//   }
// };

// export const handlePitchChange = (
//   delta,
//   pitch,
//   dispatch,
//   setPitch,
//   audioPlayedId,
//   audioContext
// ) => {
//   const newPitch = parseFloat(pitch + delta);
//   if (newPitch < 0.5 || newPitch > 2) return;
//   dispatch(setPitch({ audioPlayedId, pitch: newPitch }));

//   if (audioContext && audioContext.pitchShift) {
//     audioContext.pitchShift.pitch = newPitch - 1;
//   }
// };

// export const handleTempoChange = (
//   delta,
//   tempo,
//   dispatch,
//   setTempo,
//   audioPlayedId,
//   audioSource
// ) => {
//   const newTempo = parseFloat(tempo + delta);
//   if (newTempo < 0.5 || newTempo > 2) return;
//   dispatch(setTempo({ audioPlayedId, tempo: newTempo }));

//   if (audioSource) {
//     audioSource.playbackRate = newTempo;
//   }
// };

// export const trimAudioBuffer = (
//   audioBuffer,
//   audioContext,
//   selectedEnd,
//   selectedStart,
//   setCutWaveformBuffer,
//   setIsTrimmed
// ) => {
//   if (!audioBuffer) return;

//   const newBuffer = audioContext.context.createBuffer(
//     audioBuffer.numberOfChannels,
//     Math.floor((selectedEnd - selectedStart) * audioBuffer.length),
//     audioBuffer.sampleRate
//   );

//   for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
//     const oldChannelData = audioBuffer.getChannelData(channel);
//     const newChannelData = newBuffer.getChannelData(channel);

//     const startSample = Math.floor(selectedStart * oldChannelData.length);
//     const endSample = Math.floor(selectedEnd * oldChannelData.length);

//     for (let i = startSample, j = 0; i < endSample; i += 1, j += 1) {
//       newChannelData[j] = oldChannelData[i];
//     }
//   }

//   setCutWaveformBuffer(newBuffer);
//   setIsTrimmed(true);
// };

// export const spliceWaveform = (
//   audioBuffer,
//   cutWaveformBuffer,
//   selectedEnd,
//   selectedStart,
//   audioContext,
//   dispatch,
//   setAudioBuffer,
//   audioPlayedId
// ) => {
//   if (!audioBuffer || !cutWaveformBuffer) return;

//   const newBufferLength =
//     audioBuffer.length +
//     cutWaveformBuffer.length -
//     (selectedEnd - selectedStart) * audioBuffer.length;
//   const newBuffer = audioContext.context.createBuffer(
//     audioBuffer.numberOfChannels,
//     newBufferLength,
//     audioBuffer.sampleRate
//   );

//   for (let channel = 0; channel < audioBuffer.numberOfChannels; channel += 1) {
//     const oldChannelData = audioBuffer.getChannelData(channel);
//     const cutWaveformData = cutWaveformBuffer.getChannelData(channel);
//     const newChannelData = newBuffer.getChannelData(channel);

//     const startSample = Math.floor(selectedStart * oldChannelData.length);
//     const endSample = Math.floor(selectedEnd * oldChannelData.length);

//     for (let i = 0, j = 0; i < newBufferLength; i += 1, j += 1) {
//       if (i >= startSample && i < endSample) {
//         newChannelData[i] = cutWaveformData[j - startSample];
//       } else {
//         newChannelData[i] = oldChannelData[j];
//       }
//     }
//   }

//   dispatch(setAudioBuffer({ audioPlayedId, audioBuffer: newBuffer }));
// };

// export const handleSelectionChange = (
//   start,
//   end,
//   dispatch,
//   setSelectedEnd,
//   setSelectedStart,
//   audioBuffer,
//   setPausedTime,
//   audioPlayedId,
//   setProgressPosition
// ) => {
//   dispatch(setSelectedStart(start));
//   dispatch(setSelectedEnd(end));

//   if (audioBuffer) {
//     const newPausedTime = start * audioBuffer.duration;
//     dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
//     const newProgressPosition = start * 100;
//     dispatch(
//       setProgressPosition({
//         audioPlayedId,
//         progressPosition: newProgressPosition,
//       })
//     );
//   }
// };

// export const handleWaveformClick = (
//   progressPercentage,
//   dispatch,
//   setProgressPosition,
//   audioPlayedId,
//   audioBuffer,
//   setPausedTime
// ) => {
//   dispatch(
//     setProgressPosition({
//       audioPlayedId,
//       progressPosition: progressPercentage,
//     })
//   );

//   if (audioBuffer) {
//     const newPausedTime = (progressPercentage / 100) * audioBuffer.duration;
//     dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
//   }
// };

// export const handleFadeInChange = (event, setFadeIn) => {
//   const newFadeIn = parseFloat(event.target.value);
//   setFadeIn(newFadeIn);
// };

// export const handleFadeOutChange = (event, setFadeOut) => {
//   const newFadeOut = parseFloat(event.target.value);
//   setFadeOut(newFadeOut);
// };
