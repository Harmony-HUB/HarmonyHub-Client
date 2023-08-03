import { useDispatch } from "react-redux";
import { faPause } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsId } from "../../../../types";
import Button from "../../../../components/common/Button/Button";
import { pauseButtonThunk } from "../../../../feature/audioPlayerThunk";
import { AppDispatch } from "../../../../store";

function PauseButton({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const handlePauseAudio = () => {
    dispatch(pauseButtonThunk({ audioPlayedId }));
  };

  return (
    <div>
      <Button onClick={handlePauseAudio}>
        <FontAwesomeIcon icon={faPause} />
      </Button>
    </div>
  );
}

export default PauseButton;
