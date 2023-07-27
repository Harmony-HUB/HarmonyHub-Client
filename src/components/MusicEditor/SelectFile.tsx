import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { SelectFileButton, FileInput } from "./styles";
import { RootState } from "../../store";
import { setAudioFiles } from "../../feature/musicEditorSlice";

function SelectFile(): React.ReactElement {
  const dispatch = useDispatch();

  const audioFiles = useSelector(
    (state: RootState) => state.musicEditor.audioFiles
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const updatedAudioFiles = [...audioFiles];

      selectedFiles.forEach(selectedFile => {
        const fileURL = URL.createObjectURL(selectedFile);
        updatedAudioFiles.push({ file: fileURL, isUploaded: true });
      });
      dispatch(setAudioFiles(updatedAudioFiles));
    }
  };

  return (
    <div>
      <SelectFileButton>
        <FontAwesomeIcon icon={faUpload} /> 파일 선택
        <FileInput type="file" onChange={handleFileChange} />
      </SelectFileButton>
    </div>
  );
}

export default SelectFile;
