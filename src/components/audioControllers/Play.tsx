import { useDispatch, useSelector } from "react-redux";
import { GrainPlayer } from "tone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import PropsId from "./types";
import { RootState } from "../../store";
import {
  setAudioSource,
  setStartTime,
  setIsPlaying,
} from "../../feature/audioPlayerSlice";
import Button from "../common/Button/Button";

function Play({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch();

  const {
    audioSource,
    audioBuffer,
    audioContext,
    pausedTime,
    tempo,
    selectedStart,
    selectedEnd,
  } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const { isTrimmed } = useSelector(
    (state: RootState) => state.audioStatus.instances[audioPlayedId] || {}
  );

  const playSound = async () => {
    if (!audioContext || !audioContext.context || !audioBuffer || audioSource)
      return;

    if (audioContext.context.state === "suspended") {
      await audioContext.context.resume();
    }

    dispatch(setIsPlaying({ audioPlayedId, isPlaying: true }));

    const newAudioSource = new GrainPlayer(audioBuffer, () => {
      dispatch(setIsPlaying({ audioPlayedId, isPlaying: false }));
    });

    newAudioSource.connect(audioContext.pitchShift);
    audioContext.gainNode.connect(audioContext.context.destination);
    newAudioSource.playbackRate = tempo;
    newAudioSource.loop = false;

    const playbackOffset = isTrimmed
      ? Math.max(0, pausedTime)
      : Math.max(selectedStart * audioBuffer.duration, pausedTime);

    const duration = isTrimmed
      ? audioBuffer.duration - playbackOffset
      : (selectedEnd - selectedStart) * audioBuffer.duration - pausedTime;

    newAudioSource.start(0, playbackOffset, duration);

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

export default Play;
