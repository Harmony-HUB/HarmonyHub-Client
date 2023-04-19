/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-array-index-key */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Button from "../common/Button/Button";
import { Editor, SelectFileButton, FileInput } from "./styles";
import AudioPlayer from "../AudioPlayer/AudioPlayer";

function MusicEditor() {
  const [audioFiles, setAudioFiles] = useState([]);
  const [cutWaveformBuffer, setCutWaveformBuffer] = useState(null);
  const [selectedAudioPlayerIndex, setSelectedAudioPlayerIndex] =
    useState(null);

  const editSelectedAudioPlayerSource = newFileURL => {
    if (selectedAudioPlayerIndex === null) return;

    const updatedAudioFiles = [...audioFiles];
    updatedAudioFiles[selectedAudioPlayerIndex] = {
      file: newFileURL,
      isUploaded: true,
    };
    setAudioFiles(updatedAudioFiles);
  };

  const handleAddFileField = () => {
    setAudioFiles([...audioFiles, { file: "", isUploaded: false }]);
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

  const handleAudioPlayerClick = index => {
    if (selectedAudioPlayerIndex === index) {
      setSelectedAudioPlayerIndex(null); // Deselect the audio player if it is clicked again
    } else {
      setSelectedAudioPlayerIndex(index);
    }
  };

  return (
    <Editor>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {audioFiles.map((audioFile, index) => (
          <div
            key={`audio-file-${index}`}
            onClick={() => handleAudioPlayerClick(index)}
          >
            {audioFile.isUploaded ? (
              <AudioPlayer
                file={audioFile.file}
                cutWaveformBuffer={cutWaveformBuffer}
                setCutWaveformBuffer={setCutWaveformBuffer}
                isSelected={selectedAudioPlayerIndex === index}
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
      <Button onClick={handleAddFileField}>+</Button>
    </Editor>
  );
}

export default MusicEditor;
