import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUpload,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Editor, SelectFileButton, FileInput, BottomBar } from "./styles";
import AudioPlayer from "../AudioPlayer/AudioPlayer";
import Button from "../common/Button/Button";
import AudioStorage from "../AudioStorage";
import DownloadAudio from "../DownloadAudio";
import Modal from "../common/Modal/Modal";

function MusicEditor({ userData }) {
  const [audioFiles, setAudioFiles] = useState([]);
  const [combinedAudioBuffer, setCombinedAudioBuffer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginRight: "10px",
                }}
              >
                <Button
                  type="button"
                  onClick={() => moveAudioPlayer(index, "up")}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </Button>
                <Button
                  type="button"
                  onClick={() => moveAudioPlayer(index, "down")}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </Button>
              </div>
              {audioFiles[index]?.isUploaded ? (
                <div style={{ flex: 1 }}>
                  <AudioPlayer
                    file={audioFiles[index].file}
                    cutWaveformBuffer={audioFiles[index].audioBuffer}
                    isSelected={selectedAudioPlayerIndex === index}
                    userData={userData}
                    audioPlayedId={index}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <BottomBar>
        <div>
          <SelectFileButton>
            <FontAwesomeIcon icon={faUpload} /> 파일 선택
            <FileInput type="file" onChange={handleFileChange} />
          </SelectFileButton>
        </div>
        <div>
          {audioFiles.length >= 2 && (
            <Button
              onClick={handleMergeAudioClick}
              style={{ marginRight: "10px" }}
            >
              오디오 결합
            </Button>
          )}
        </div>
        <Button onClick={openModal}>Save</Button>
        {showModal && (
          <Modal isOpen={showModal} onClose={closeModal}>
            <AudioStorage
              userData={userData}
              audioBuffer={combinedAudioBuffer}
            />
            <DownloadAudio audioBuffer={combinedAudioBuffer} />
          </Modal>
        )}
      </BottomBar>
    </Editor>
  );
}

export default MusicEditor;
