import { useDispatch, useSelector } from "react-redux";
import { faHashtag, faMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setPitch } from "../../feature/audioPlayerSlice";
import PropsId from "./types";
import { RootState } from "../../store";
import Button from "../common/Button/Button";

function Pitch({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch();

  const { pitch, audioContext } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const handlePitchChange = (delta: number) => {
    const newPitch = pitch + delta;

    if (newPitch < 0.5 || newPitch > 2) return;
    dispatch(setPitch({ audioPlayedId, pitch: newPitch }));

    if (audioContext && audioContext.pitchShift) {
      audioContext.pitchShift.pitch = newPitch - 1;
    }
  };

  return (
    <div>
      <Button onClick={() => handlePitchChange(-0.1)}>
        <FontAwesomeIcon icon={faMinus} />
      </Button>
      <Button onClick={() => handlePitchChange(0.1)}>
        <FontAwesomeIcon icon={faHashtag} />
      </Button>
    </div>
  );
}

export default Pitch;