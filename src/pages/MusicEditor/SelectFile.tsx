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
  const [audioFiles, setAudioFiles] = useState<FileObject[]>([]);

  const dispatch = useDispatch();

  const audioContext = useSelector(
    (state: RootState) => state.audioContext.audioContext
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      const updatedAudioFiles = [...audioFiles];

      selectedFiles.forEach(selectedFile => {
        const fileURL = URL.createObjectURL(selectedFile);
        updatedAudioFiles.push({ file: fileURL, isUploaded: true });
      });
      setAudioFiles(updatedAudioFiles);
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
    let isMounted = true;

    const loadAllFiles = async () => {
      let updatedBuffers: AudioBuffer[] = [];
      for (let i = 0; i < audioFiles.length; i += 1) {
        const newBuffer = await loadAudioFile(audioFiles[i]);

        if (newBuffer) {
          updatedBuffers = updatedBuffers.concat(newBuffer);
        }
      }

      if (isMounted) {
        dispatch(setAudioBuffers(updatedBuffers));
      }
    };

    loadAllFiles();

    return () => {
      isMounted = false;
    };
  }, [audioFiles]);

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
