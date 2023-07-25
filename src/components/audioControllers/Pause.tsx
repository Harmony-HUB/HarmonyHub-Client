import { useDispatch, useSelector } from "react-redux";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropsId from "./types";
import { RootState } from "../../store";
import {
  setIsPlaying,
  setPausedTime,
  setAudioSource,
} from "../../feature/audioPlayerSlice";
import Button from "../common/Button/Button";

function Pause({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch();

  const { audioSource, audioContext, startTime, pausedTime } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const pauseSound = () => {
    if (!audioSource) return;

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));

    audioSource.stop();

    if (audioContext) {
      const elapsedTime = audioContext.context.currentTime - startTime;
      const newPausedTime = elapsedTime + pausedTime;

      dispatch(setPausedTime({ audioPlayedId, pausedTime: newPausedTime }));
      dispatch(setAudioSource({ audioPlayedId, audioSource: null }));
    }
  };

  return (
    <div>
      <Button onClick={pauseSound}>
        <FontAwesomeIcon icon={faPause} />
      </Button>
    </div>
  );
}

export default Pause;
