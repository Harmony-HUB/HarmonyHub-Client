import { UserData } from "../../types";

export interface AudioRecorderStorageProps {
  audioBuffer: AudioBuffer;
  userData: UserData;
}

export interface AudioStorageProps extends AudioRecorderStorageProps {
  audioPlayedId: number;
}

export interface DownloadAudioProps {
  audioBuffer: AudioBuffer | null;
}
