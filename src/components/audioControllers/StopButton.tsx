import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { PropsId } from "../../types";
import {
  setAudioSource,
  setPausedTime,
  setProgressPosition,
} from "../../feature/audioPlayerSlice";
import { setIsPlaying } from "../../feature/audioStatusSlice";
import { RootState } from "../../store";
import Button from "../common/Button/Button";

function StopButton({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch();

  const { audioSource, selectedStart, audioBuffer } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const stopSound = () => {
    if (!audioSource) return;

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));

    audioSource.stop();
    dispatch(setAudioSource({ audioPlayedId, audioSource: null }));

    if (audioBuffer) {
      const newPausedTime = selectedStart * audioBuffer.duration;
      dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
    }

    dispatch(
      setProgressPosition({
        audioPlayedId,
        progressPosition: selectedStart * 100,
      })
    );
  };
  return (
    <div>
      <Button onClick={stopSound}>
        <FontAwesomeIcon icon={faStop} />
      </Button>
    </div>
  );
}

export default StopButton;
