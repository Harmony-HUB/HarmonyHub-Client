import toWav from "audiobuffer-to-wav";
import * as Tone from "tone";

export async function applyAdjustments(
  buffer: AudioBuffer,
  pitch: number,
  tempo: number
): Promise<Tone.ToneAudioBuffer> {
  return Tone.Offline(
    async () => {
      const pitchShift = new Tone.PitchShift(pitch);
      const source = new Tone.GrainPlayer(buffer).connect(pitchShift);
      source.playbackRate = tempo;
      pitchShift.toDestination();
      source.start(0);
    },
    buffer.duration * (1 / tempo)
  );
}

export function bufferToWav(buffer: AudioBuffer): Blob {
  const wavArrayBuffer = toWav(buffer);
  const wavBlob = new Blob([wavArrayBuffer], { type: "audio/wav" });
  return wavBlob;
}

export function toneAudioBufferToAudioBuffer(
  toneBuffer: Tone.ToneAudioBuffer
): AudioBuffer {
  console.log(toneBuffer);
  const offlineContext = new OfflineAudioContext(
    toneBuffer.numberOfChannels,
    toneBuffer.length,
    Tone.context.sampleRate
  );

  const audioBuffer = offlineContext.createBuffer(
    toneBuffer.numberOfChannels,
    toneBuffer.length,
    Tone.context.sampleRate
  );

  for (let channel = 0; channel < toneBuffer.numberOfChannels; channel += 1) {
    const channelData = toneBuffer.getChannelData(channel);
    audioBuffer.copyToChannel(channelData, channel);
  }

  return audioBuffer;
}
