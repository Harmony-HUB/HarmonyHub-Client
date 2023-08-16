import { useEffect } from "react";
import { useDispatch } from "react-redux";
import Waveform from "./Waveform/Waveform";
import AudioStorage from "../../Storage/AudioStorage";
import { AudioControlsContainer, AudioPlayerContainer } from "./styles";
import { setAudioBuffer } from "../../../feature/audioPlayerSlice";
import Volume from "./audioControllers/Volume/VolumeSlider";
import Play from "./audioControllers/PlayButton";
import Stop from "./audioControllers/StopButton";
import Pause from "./audioControllers/PauseButton";
import Pitch from "./audioControllers/PitchButton";
import Tempo from "./audioControllers/TempoButton";
import TrimAudio from "./audioControllers/TrimButton";

interface AudioPlayerProps {
  audioPlayedId: number;
  audioBuffer: AudioBuffer;
}

function AudioPlayer({
  audioPlayedId,
  audioBuffer,
}: AudioPlayerProps): React.ReactElement {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setAudioBuffer({ audioPlayedId, audioBuffer }));
  }, [audioBuffer]);

  return (
    <AudioPlayerContainer data-testid="audio-player-container">
      <Waveform audioPlayedId={audioPlayedId} />
      <AudioControlsContainer>
        <Play audioPlayedId={audioPlayedId} />
        <Stop audioPlayedId={audioPlayedId} />
        <Pause audioPlayedId={audioPlayedId} />
        <Pitch audioPlayedId={audioPlayedId} />
        <Tempo audioPlayedId={audioPlayedId} />
        <TrimAudio audioPlayedId={audioPlayedId} />
        <Volume audioPlayedId={audioPlayedId} />
        <AudioStorage
          // userData={userData}
          audioBuffer={audioBuffer}
          audioPlayedId={audioPlayedId}
        />
      </AudioControlsContainer>
    </AudioPlayerContainer>
  );
}
export default AudioPlayer;
