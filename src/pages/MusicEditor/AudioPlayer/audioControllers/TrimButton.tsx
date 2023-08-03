import { useDispatch } from "react-redux";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropsId } from "../../../../types";
import Button from "../../../../components/common/Button/Button";
import { AppDispatch } from "../../../../store";
import { trimButtonThunk } from "../../../../feature/audioPlayerThunk";

function TrimButton({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch<AppDispatch>();

  const handleTrimAudio = () => {
    dispatch(trimButtonThunk({ audioPlayedId }));
  };

  return (
    <div>
      <Button onClick={handleTrimAudio}>
        <FontAwesomeIcon icon={faScissors} />
      </Button>
    </div>
  );
}

export default TrimButton;
