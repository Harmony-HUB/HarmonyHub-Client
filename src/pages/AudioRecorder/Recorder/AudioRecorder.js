import { useState, useRef, useEffect } from "react";
import {
  faStop,
  faMicrophone,
  faPlay,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import Button from "../../../components/common/Button/Button.tsx";
import AudioRecorderStorage from "../../Storage/AudioRecorderStorage.tsx";
import { SelectFileButton, FileInput } from "../../MusicEditor/styles.tsx";
import Waveform from "../../MusicEditor/AudioPlayer/Waveform/Waveform.tsx";

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
  cursor: pointer;
`;

const StageWrapper = styled.div`
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
`;

const ExplainStage = styled.h1`
  margin: 0;
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
        <StageWrapper>
          <ExplainStage>함께 녹음할 음원 파일을 선택하세요</ExplainStage>
          <SelectFileButton>
            <FontAwesomeIcon icon={faUpload} /> 파일 선택
            <FileInput type="file" onChange={handleFileUpload} />
          </SelectFileButton>
        </StageWrapper>
      )}
      {stage === 1 && (
        <StageWrapper>
          <ExplainStage>마이크 버튼을 누르면 음악이 재생됩니다.</ExplainStage>
          <Waveform
            file={uploadedFile}
            audioPlayedId={10}
            recording={isRecord}
          />
          <RecordButton onClick={recording ? stopRecording : startRecording}>
            <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
          </RecordButton>
        </StageWrapper>
      )}
      {stage === 2 && (
        <StageWrapper>
          <ExplainStage>녹음된 음원 재생하기</ExplainStage>
          {recordedAudioURL && uploadedFile && (
            <Button onClick={togglePlayStop}>
              <FontAwesomeIcon icon={playing ? faStop : faPlay} />
            </Button>
          )}
          <AudioRecorderStorage
            audioBuffer={combinedAudioBuffer}
            userData={userData}
          />
        </StageWrapper>
      )}
    </div>
  );
}

export default AudioRecorder;
