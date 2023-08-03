import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop } from "@fortawesome/free-solid-svg-icons";
import { PropsId } from "../../../../types";
import Button from "../../../../components/common/Button/Button";
import { stopButtonThunk } from "../../../../feature/audioPlayerThunk";
import { AppDispatch } from "../../../../store";

function StopButton({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const handleStopAudio = () => {
    dispatch(stopButtonThunk({ audioPlayedId }));
  };
  return (
    <div>
      <Button onClick={handleStopAudio}>
        <FontAwesomeIcon icon={faStop} />
      </Button>
    </div>
  );
}

export default StopButton;
