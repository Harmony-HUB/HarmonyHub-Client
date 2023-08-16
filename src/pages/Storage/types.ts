export interface AudioRecorderStorageProps {
  audioBuffer: AudioBuffer | null;
}

export interface AudioStorageProps extends AudioRecorderStorageProps {
  audioPlayedId: number;
}

export interface DownloadAudioProps {
  audioBuffer: AudioBuffer | null;
}
