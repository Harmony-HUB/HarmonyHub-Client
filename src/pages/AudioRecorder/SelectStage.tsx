import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import {
  setUploadedFile,
  setAudioBuffer,
  setStage,
} from "../../feature/recorderSlice";
import { RootState } from "../../store";
import { StageWrapper, ExplainStage } from "./styles";
import { SelectFileButton, FileInput } from "../MusicEditor/styles";

function SelectStage() {
  const audioContext = useSelector(
    (state: RootState) => state.audioRecorder.audioContext
  );

  const dispatch = useDispatch();
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      dispatch(setUploadedFile(null));
      return;
    }
    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    dispatch(setUploadedFile(fileURL));
    const arrayBuffer = await file.arrayBuffer();

    if (audioContext) {
      const newAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      dispatch(setAudioBuffer(newAudioBuffer));
    }

    dispatch(setStage(2));
  };

  return (
    <StageWrapper>
      <ExplainStage>함께 녹음할 음원 파일을 선택하세요</ExplainStage>
      <SelectFileButton>
        <FontAwesomeIcon icon={faUpload} /> 파일 선택
        <FileInput type="file" onChange={handleFileUpload} />
      </SelectFileButton>
    </StageWrapper>
  );
}

export default SelectStage;
