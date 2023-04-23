import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Editor, SelectFileButton, FileInput } from "./styles";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Button from "../common/Button/Button";
import AudioStorage from "../AudioStorage";

function MusicEditor({ userData }) {
  const [audioFiles, setAudioFiles] = useState([]);
  const [combinedAudioBuffer, setCombinedAudioBuffer] = useState(null);
  const selectedAudioPlayerIndex = null;
  const fields = [1, 2, 3];

  const audioBuffers = useSelector(state => {
    const { instances } = state.audioPlayer;
    return [0, 1, 2].map(index => instances[index]?.audioBuffer || null);
  });

  useEffect(() => {
    console.log("BUFFER: ", combinedAudioBuffer);
  }, [combinedAudioBuffer]);

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

  function concatenateAudioBuffers(buffers) {
    if (buffers.length === 0 || buffers.some(buffer => buffer === null)) {
      console.error(
        "Invalid input: buffers array is empty or contains null elements."
      );

      return null;
    }

    const { numberOfChannels, sampleRate } = buffers[0];

    const totalLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0);

    const outputBuffer = new AudioBuffer({
      length: totalLength,
      numberOfChannels,
      sampleRate,
    });

    let currentPosition = 0;

    buffers.forEach(buffer => {
      for (let channel = 0; channel < numberOfChannels; channel += 1) {
        const outputData = outputBuffer.getChannelData(channel);
        const inputData = buffer.getChannelData(channel);
        outputData.set(inputData, currentPosition);
      }
      currentPosition += buffer.length;
    });

    return outputBuffer;
  }

  const handleMergeAudioClick = () => {
    const nonNullBuffers = audioBuffers.filter(buffer => buffer !== null);

    if (nonNullBuffers.length >= 2) {
      setCombinedAudioBuffer(concatenateAudioBuffers(nonNullBuffers));
    }
  };

  const moveAudioPlayer = (index, direction) => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === audioFiles.length - 1)
    ) {
      return;
    }

    const updatedAudioFiles = [...audioFiles];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [updatedAudioFiles[index], updatedAudioFiles[newIndex]] = [
      updatedAudioFiles[newIndex],
      updatedAudioFiles[index],
    ];
    setAudioFiles(updatedAudioFiles);
  };

  return (
    <Editor>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {fields.map((field, index) => (
          <div key={`field-${field}`} style={{ marginBottom: "15px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <button
                type="button"
                onClick={() => moveAudioPlayer(index, "up")}
              >
                Up
              </button>
              <button
                type="button"
                onClick={() => moveAudioPlayer(index, "down")}
              >
                Down
              </button>
            </div>
            {audioFiles[index]?.isUploaded ? (
              <AudioPlayer
                file={audioFiles[index].file}
                cutWaveformBuffer={audioFiles[index].audioBuffer}
                isSelected={selectedAudioPlayerIndex === index}
                userData={userData}
                audioPlayedId={index}
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
      <Button onClick={handleMergeAudioClick}>합치기</Button>
      <AudioStorage userData={userData} audioBuffer={combinedAudioBuffer}>
        저장하기
      </AudioStorage>
    </Editor>
  );
}

export default MusicEditor;
