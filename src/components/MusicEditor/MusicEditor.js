import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Editor, SelectFileButton, FileInput } from "./styles";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

function MusicEditor({ userData }) {
  const [audioFiles, setAudioFiles] = useState([]);
  const selectedAudioPlayerIndex = null;
  const fields = [1, 2, 3];

  const editSelectedAudioPlayerSource = (index, newFileURL, audioBuffer) => {
    if (selectedAudioPlayerIndex === null) return;

    const updatedAudioFiles = [...audioFiles];
    updatedAudioFiles[index] = {
      file: newFileURL,
      isUploaded: true,
      audioBuffer,
    };
    setAudioFiles(updatedAudioFiles);
  };

  const handleFileChange = (event, index) => {
    const selectedFile = event.target.files[0];
    const fileURL = URL.createObjectURL(selectedFile);

    if (
      selectedAudioPlayerIndex !== null &&
      selectedAudioPlayerIndex === index
    ) {
      editSelectedAudioPlayerSource(selectedAudioPlayerIndex, fileURL);
    } else {
      const updatedAudioFiles = [...audioFiles];
      updatedAudioFiles[index] = { file: fileURL, isUploaded: true };
      setAudioFiles(updatedAudioFiles);
    }
  };

  return (
    <Editor>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, index) => (
          <div key={`field-${field}`} style={{ marginBottom: "15px" }}>
            {audioFiles[index]?.isUploaded ? (
              <AudioPlayer
                file={audioFiles[index].file}
                cutWaveformBuffer={audioFiles[index].audioBuffer}
                isSelected={selectedAudioPlayerIndex === index}
                userData={userData}
              />
            ) : (
              <SelectFileButton>
                <FontAwesomeIcon icon={faUpload} /> 파일 선택
                <FileInput
                  type="file"
                  onChange={event => handleFileChange(event, index)}
                />
              </SelectFileButton>
            )}
          </div>
        ))}
      </div>
    </Editor>
  );
}

export default MusicEditor;
