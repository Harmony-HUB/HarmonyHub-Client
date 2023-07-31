import { useSelector, useDispatch } from "react-redux";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../../store";
import Button from "../../components/common/Button/Button";
import { MoveButtonContainer } from "./styles";
import { setAudioBuffers } from "../../feature/musicEditorSlice";

interface MoveAudioPlayerProps {
  index: number;
}

function MoveAudioPlayer({ index }: MoveAudioPlayerProps): React.ReactElement {
  const dispatch = useDispatch();

  const audioBuffers = useSelector(
    (state: RootState) => state.musicEditor.audioBuffers
  );

  const moveAudioPlayer = (direction: string) => {
    if (!audioBuffers) return;

    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === audioBuffers.length - 1)
    ) {
      return;
    }

    const updateAudioBuffers: Array<AudioBuffer | null> = [...audioBuffers];

    const newIndex = direction === "up" ? index - 1 : index + 1;

    [updateAudioBuffers[index], updateAudioBuffers[newIndex]] = [
      updateAudioBuffers[newIndex],
      updateAudioBuffers[index],
    ];

    dispatch(setAudioBuffers(updateAudioBuffers));
  };

  return (
    <MoveButtonContainer>
      <Button onClick={() => moveAudioPlayer("up")}>
        <FontAwesomeIcon icon={faArrowUp} />
      </Button>
      <Button onClick={() => moveAudioPlayer("down")}>
        <FontAwesomeIcon icon={faArrowDown} />
      </Button>
    </MoveButtonContainer>
  );
}

export default MoveAudioPlayer;
