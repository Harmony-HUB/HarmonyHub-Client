import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { PropsId } from "../../../../types";
import { AppDispatch } from "../../../../store";
import Button from "../../../../components/common/Button/Button";
import { playButtonThunk } from "../../../../feature/audioPlayerThunk";

function PlayButton({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const handlePlayAudio = () => {
    dispatch(playButtonThunk({ audioPlayedId }));
  };

  return (
    <div>
      <Button onClick={handlePlayAudio}>
        <FontAwesomeIcon icon={faPlay} />
      </Button>
    </div>
  );
}

export default PlayButton;
