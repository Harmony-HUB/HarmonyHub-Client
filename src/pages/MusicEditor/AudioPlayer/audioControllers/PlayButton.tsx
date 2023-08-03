import { useDispatch, useSelector } from "react-redux";
import { GrainPlayer } from "tone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { PropsId } from "../../../../types";
import { RootState } from "../../../../store";
import {
  setAudioSource,
  setStartTime,
} from "../../../../feature/audioPlayerSlice";
import { setIsPlaying } from "../../../../feature/audioStatusSlice";
import Button from "../../../../components/common/Button/Button";

function PlayButton({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch();

  const {
    audioSource,
    audioBuffer,
    pausedTime,
    tempo,
    selectedStart,
    selectedEnd,
  } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const audioContext = useSelector(
    (state: RootState) => state.audioContext.audioContext
  );

  const { isTrimmed } = useSelector(
    (state: RootState) => state.audioStatus.instances[audioPlayedId] || {}
  );

  const playSound = async () => {
    if (!audioContext || !audioContext.context || !audioBuffer || audioSource) {
      return;
    }

    if (audioContext.context.state === "suspended") {
      await audioContext.context.resume();
    }

    const newAudioSource = new GrainPlayer(audioBuffer, () => {
      dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));
    });

    newAudioSource.connect(audioContext.pitchShift);

    newAudioSource.playbackRate = tempo;
    newAudioSource.loop = false;

    const playbackOffset = isTrimmed
      ? Math.max(0, pausedTime)
      : Math.max(selectedStart * audioBuffer.duration, pausedTime);

    const duration = isTrimmed
      ? audioBuffer.duration - playbackOffset
      : (selectedEnd - selectedStart) * audioBuffer.duration - pausedTime;

    newAudioSource.start(0, playbackOffset, duration);

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: true }));
    dispatch(setAudioSource({ audioPlayedId, audioSource: newAudioSource }));
    dispatch(
      setStartTime({
        audioPlayedId,
        startTime: audioContext.context.currentTime,
      })
    );
  };

  return (
    <div>
      <Button onClick={playSound}>
        <FontAwesomeIcon icon={faPlay} />
      </Button>
    </div>
  );
}

export default PlayButton;
