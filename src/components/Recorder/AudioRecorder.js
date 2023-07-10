import React, { useState, useRef, useEffect } from "react";
import {
  faStop,
  faMicrophone,
  faPlay,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import AudioRecorderStorage from "../Storage/AudioRecorderStorage";
import Button from "../common/Button/Button";
import { SelectFileButton, FileInput } from "../MusicEditor/styles";
import Waveform from "../Waveform/Waveform";

const RecordButton = styled.button`
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 50%;
  border: 0.5 solid black;
  outline: 10px;
  margin: 10px;
  cursor: pointer;
`;

const CompleteWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const FirstStageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

function AudioRecorder({ userData }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaRecorderInstance, setMediaRecorder] = useState(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [combinedAudioBuffer, setCombinedAudioBuffer] = useState(null);
  const [stage, setStage] = useState(0);
  const [playing, setPlaying] = useState(false);

  const audioContext = useRef(new AudioContext());
  const uploadedBuffer = useRef(null);
  const recordedBuffer = useRef(null);
  const bufferSourceRef = useRef(null);
  const uploadedBufferSourceRef = useRef(null);

  const isRecord = true;

  const handleFileUpload = async e => {
    if (!e.target.files.length) {
      setUploadedFile(null);
      return;
    }

    const file = e.target.files[0];
    const fileURL = URL.createObjectURL(file);
    setUploadedFile(fileURL);

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer);
    uploadedBuffer.current = audioBuffer;

    setStage(1);
  };

  const startRecording = async () => {
    if (uploadedBuffer.current) {
      const bufferSource = audioContext.current.createBufferSource();
      bufferSource.buffer = uploadedBuffer.current;
      bufferSource.connect(audioContext.current.destination);
      bufferSource.start();
      uploadedBufferSourceRef.current = bufferSource;
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(newMediaRecorder);

    newMediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        setRecordedChunks(prev => [...prev, e.data]);
      }
    };

    newMediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderInstance) {
      mediaRecorderInstance.stop();
      setRecording(false);
    }

    if (uploadedBufferSourceRef.current) {
      uploadedBufferSourceRef.current.stop();
      uploadedBufferSourceRef.current = null;
    }

    setStage(2);
  };

  const togglePlayStop = async () => {
    if (!uploadedBuffer.current || !recordedBuffer.current) return;

    if (!playing) {
      const combinedBuffer = new AudioBuffer({
        length: Math.max(
          uploadedBuffer.current.length,
          recordedBuffer.current.length
        ),
        numberOfChannels: 2,
        sampleRate: audioContext.current.sampleRate,
      });

      combinedBuffer.copyToChannel(uploadedBuffer.current.getChannelData(0), 0);
      combinedBuffer.copyToChannel(recordedBuffer.current.getChannelData(0), 1);

      setCombinedAudioBuffer(combinedBuffer);

      const bufferSource = audioContext.current.createBufferSource();

      bufferSource.buffer = combinedBuffer;
      bufferSource.connect(audioContext.current.destination);
      bufferSource.start();
      bufferSourceRef.current = bufferSource;

      setPlaying(true);
    } else if (bufferSourceRef.current) {
      bufferSourceRef.current.stop();
      bufferSourceRef.current = null;
      setPlaying(false);
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const recordedBlob = new Blob(recordedChunks, { type: "audio/webm" });
      const recordedURL = URL.createObjectURL(recordedBlob);
      setRecordedAudioURL(recordedURL);
      const reader = new FileReader();
      reader.onload = async e => {
        const arrayBuffer = e.target.result;
        const audioBuffer = await audioContext.current.decodeAudioData(
          arrayBuffer
        );
        recordedBuffer.current = audioBuffer;
      };
      reader.readAsArrayBuffer(recordedBlob);
    }
  }, [recordedChunks]);

  return (
    <div>
      {stage === 0 && (
        <FirstStageWrapper>
          <h1>함께 녹음할 음원 파일을 선택하세요</h1>
          <SelectFileButton>
            <FontAwesomeIcon icon={faUpload} /> 파일 선택
            <FileInput type="file" onChange={handleFileUpload} />
          </SelectFileButton>
        </FirstStageWrapper>
      )}
      {stage === 1 && (
        <FirstStageWrapper>
          <Waveform
            file={uploadedFile}
            audioPlayedId={10}
            recording={isRecord}
          />
          <h1>마이크 버튼을 누르면 음악이 재생됩니다.</h1>
          <RecordButton onClick={recording ? stopRecording : startRecording}>
            <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
          </RecordButton>
        </FirstStageWrapper>
      )}
      {stage === 2 && (
        <CompleteWrapper>
          <h1>녹음된 음원 재생하기</h1>
          <div>
            {recordedAudioURL && uploadedFile && (
              <Button onClick={togglePlayStop}>
                <FontAwesomeIcon icon={playing ? faStop : faPlay} />
              </Button>
            )}
          </div>
          <AudioRecorderStorage
            audioBuffer={combinedAudioBuffer}
            userData={userData}
          />
        </CompleteWrapper>
      )}
    </div>
  );
}

export default AudioRecorder;
