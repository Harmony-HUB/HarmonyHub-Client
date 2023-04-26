import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Editor, SelectFileButton, FileInput, BottomBar } from "./styles";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Button from "../common/Button/Button";
import AudioStorage from "../AudioStorage";
import DownloadAudio from "../DownloadAudio";

function MusicEditor({ userData }) {
  const [audioFiles, setAudioFiles] = useState([]);
  const [combinedAudioBuffer, setCombinedAudioBuffer] = useState(null);

  const selectedAudioPlayerIndex = null;

  const audioBuffers = useSelector(state => {
    const { instances } = state.audioPlayer;
    return [0, 1, 2, 4, 5].map(index => instances[index]?.audioBuffer || null);
  });

  const handleFileChange = event => {
    const selectedFiles = Array.from(event.target.files);

    const updatedAudioFiles = [...audioFiles];

    selectedFiles.forEach(selectedFile => {
      const fileURL = URL.createObjectURL(selectedFile);
      updatedAudioFiles.push({ file: fileURL, isUploaded: true });
    });

    setAudioFiles(updatedAudioFiles);
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
    console.log(combinedAudioBuffer);
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
        {audioFiles.map((_, index) => (
          <div key={`field-${index + 3}`} style={{ marginBottom: "15px" }}>
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
            ) : null}
          </div>
        ))}
      </div>
      <BottomBar>
        <SelectFileButton>
          <FontAwesomeIcon icon={faUpload} /> 파일 선택
          <FileInput type="file" onChange={handleFileChange} multiple />
        </SelectFileButton>
        <Button onClick={handleMergeAudioClick} style={{ marginRight: "10px" }}>
          합치기
        </Button>
        <AudioStorage userData={userData} audioBuffer={combinedAudioBuffer}>
          저장하기
        </AudioStorage>
        <DownloadAudio audioBuffer={combinedAudioBuffer} />
      </BottomBar>
    </Editor>
  );
}

export default MusicEditor;
