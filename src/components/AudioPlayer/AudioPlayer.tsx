import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Waveform from "../Waveform/Waveform";
import AudioStorage from "../Storage/AudioStorage";
import { AudioPlayerContainer, ButtonContainer } from "./styles";
import {
  setSelectedStart,
  setSelectedEnd,
  setAudioBuffer,
} from "../../feature/audioPlayerSlice";
import Volume from "../audioControllers/Volume/Volume";
import Play from "../audioControllers/Play";
import Stop from "../audioControllers/Stop";
import Pause from "../audioControllers/Pause";
import Pitch from "../audioControllers/Pitch";
import Tempo from "../audioControllers/Tempo";
import TrimAudio from "../audioControllers/Trim";
import UserData from "../../types";

interface AudioPlayerProps {
  userData: UserData;
  audioPlayedId: number;
  audioBuffer: AudioBuffer;
}

function AudioPlayer({
  userData,
  audioPlayedId,
  audioBuffer,
}: AudioPlayerProps): React.ReactElement {
  const dispatch = useDispatch();

  dispatch(setAudioBuffer({ audioPlayedId, audioBuffer }));

  useEffect(() => {
    dispatch(setSelectedStart({ audioPlayedId, selectedStart: 0 }));
    dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: 1 }));
  }, []);

  return (
    <AudioPlayerContainer data-testid="audio-player-container">
      <Waveform audioPlayedId={audioPlayedId} />
      <Play audioPlayedId={audioPlayedId} />
      <Stop audioPlayedId={audioPlayedId} />
      <Volume audioPlayedId={audioPlayedId} />
      <Pause audioPlayedId={audioPlayedId} />
      <Pitch audioPlayedId={audioPlayedId} />
      <Tempo audioPlayedId={audioPlayedId} />
      <TrimAudio audioPlayedId={audioPlayedId} />
      <ButtonContainer>
        <AudioStorage userData={userData} audioBuffer={audioBuffer} />
      </ButtonContainer>
    </AudioPlayerContainer>
  );
}
export default AudioPlayer;
