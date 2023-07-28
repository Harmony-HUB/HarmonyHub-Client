import { useSelector } from "react-redux";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RootState } from "../../store";
import Button from "../../components/common/Button/Button";

function MoveAudioPlayer(): React.ReactElement {
  const audioBuffers = useSelector((state: RootState) => {
    const { instances } = state.audioPlayer;
    return [0, 1, 2, 3, 4].map(index => instances[index]?.audioBuffer || null);
  });

  const moveAudioPlayer = (index: number, direction: string) => {
    if (!audioBuffers) return;

    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === audioBuffers.length - 1)
    ) {
      return;
    }

    const updateAudioBuffers = [...audioBuffers];

    const newIndex = direction === "up" ? index - 1 : index + 1;

    [updateAudioBuffers[index], updateAudioBuffers[newIndex]] = [
      updateAudioBuffers[newIndex],
      updateAudioBuffers[index],
    ];

    // dispatch(setAudioBuffer(updateAudioBuffers));
  };

  return (
    <>
      <Button onClick={() => moveAudioPlayer(1, "up")}>
        <FontAwesomeIcon icon={faArrowUp} />
      </Button>
      <Button onClick={() => moveAudioPlayer(2, "down")}>
        <FontAwesomeIcon icon={faArrowDown} />
      </Button>
    </>
  );
}

export default MoveAudioPlayer;
