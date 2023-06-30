import React, { useState, useRef, useEffect } from "react";
import {
  faStop,
  faMicrophone,
  faPlay,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AudioRecorderStorage from "../Storage/AudioRecorderStorage";
import Button from "../common/Button/Button";
import { SelectFileButton, FileInput } from "../MusicEditor/styles";

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

  const handleFileUpload = async e => {
    if (!e.target.files.length) {
      setUploadedFile(null);
      return;
    }

    const file = e.target.files[0];
    setUploadedFile(file);

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
    } else {
      setPlaying(false);
    }
  };

  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  useEffect(() => {
    if (uploadedBuffer.current && recordedBuffer.current) {
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
    }
  }, [uploadedBuffer.current, recordedBuffer.current]);

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

  const buttonStyles = {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "5rem",
    borderRadius: "50%",
    border: "none",
    background: "gray",
    outline: "black",
    zIndex: 1,
    position: "absolute",
    top: 0,
    left: 0,
  };

  return (
    <div>
      {stage === 0 && (
        <SelectFileButton>
          <FontAwesomeIcon icon={faUpload} /> 파일 선택
          <FileInput type="file" onChange={handleFileUpload} />
        </SelectFileButton>
      )}
      {stage === 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <button
            type="button"
            style={buttonStyles}
            onClick={recording ? stopRecording : startRecording}
          >
            <FontAwesomeIcon icon={recording ? faStop : faMicrophone} />
          </button>
        </div>
      )}
      {stage === 2 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <div>
            {recordedAudioURL && (
              <>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <audio src={recordedAudioURL} controls />
              </>
            )}
          </div>
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
        </div>
      )}
    </div>
  );
}

export default AudioRecorder;
