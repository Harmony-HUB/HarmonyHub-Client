import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { RootState } from "../../../store";

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

  const { isPlaying } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  return (
    <div>
      <AudioPlayerContainer data-testid="audio-player-container">
        <Waveform audioPlayedId={audioPlayedId} />
      </AudioPlayerContainer>

      <AudioControlsContainer>
        {isPlaying ? (
          <Pause audioPlayedId={audioPlayedId} />
        ) : (
          <Play audioPlayedId={audioPlayedId} />
        )}
        <Stop audioPlayedId={audioPlayedId} />
        <Pitch audioPlayedId={audioPlayedId} />
        <Tempo audioPlayedId={audioPlayedId} />
        <TrimAudio audioPlayedId={audioPlayedId} />
        <AudioStorage audioBuffer={audioBuffer} audioPlayedId={audioPlayedId} />
        <Volume audioPlayedId={audioPlayedId} />
      </AudioControlsContainer>
    </div>
  );
}
export default AudioPlayer;
