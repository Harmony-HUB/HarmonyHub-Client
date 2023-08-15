/* eslint-disable no-await-in-loop */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { SelectFileButton, FileInput } from "./styles";
import { RootState } from "../../store";
import { setAudioBuffers } from "../../feature/musicEditorSlice";

interface FileObject {
  file: string;
  isUploaded: boolean;
}

function SelectFile(): React.ReactElement {
  const [audioFile, setAudioFile] = useState<FileObject | null>(null);
  const dispatch = useDispatch();

  const audioContext = useSelector(
    (state: RootState) => state.audioContext.audioContext
  );
  const audioBuffers = useSelector(
    (state: RootState) => state.musicEditor.audioBuffers
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFile = event.target.files[0];

      const fileURL = URL.createObjectURL(selectedFile);

      setAudioFile({ file: fileURL, isUploaded: true });
    }
  };

  const loadAudioFile = async (file: FileObject) => {
    if (!audioContext) return;
    try {
      const response = await fetch(file.file);
      const audioData = await response.arrayBuffer();
      const newAudioBuffer = await audioContext.context.decodeAudioData(
        audioData
      );

      return newAudioBuffer;
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      return null;
    }
  };

  useEffect(() => {
    const loadAllFiles = async () => {
      if (audioFile) {
        const newBuffer = (await loadAudioFile(audioFile)) as AudioBuffer;

        if (newBuffer) {
          dispatch(setAudioBuffers([...audioBuffers, newBuffer]));
        }
      }
    };

    loadAllFiles();
  }, [audioFile]);

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
