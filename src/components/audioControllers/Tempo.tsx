import { useDispatch, useSelector } from "react-redux";
import {
  faBackwardFast,
  faForwardFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setTempo } from "../../feature/audioPlayerSlice";
import PropsId from "./types";
import { RootState } from "../../store";
import Button from "../common/Button/Button";

function Tempo({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch();

  const { tempo, audioSource } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const handleTempoChange = (delta: number) => {
    const newTempo = tempo + delta;
    if (newTempo < 0.5 || newTempo > 2) return;
    dispatch(setTempo({ audioPlayedId, tempo: newTempo }));

    if (audioSource) {
      (audioSource.playbackRate as unknown) = newTempo;
    }
  };

  return (
    <div>
      <Button onClick={() => handleTempoChange(-0.1)}>
        <FontAwesomeIcon icon={faBackwardFast} />
      </Button>
      <Button onClick={() => handleTempoChange(0.1)}>
        <FontAwesomeIcon icon={faForwardFast} />
      </Button>
    </div>
  );
}

export default Tempo;
