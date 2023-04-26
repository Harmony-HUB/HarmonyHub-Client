import React, { useState, useRef, useEffect } from "react";
import AudioRecorderStorage from "./AudioRecorderStorage";
import Button from "./common/Button/Button";
import CircleModal from "./common/Modal/CircleModal";

function AudioRecorder({ isOpen, onClose, userData }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [mediaRecorderInstance, setMediaRecorder] = useState(null);
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [combinedAudioBuffer, setCombinedAudioBuffer] = useState(null);

  const audioContext = useRef(new AudioContext());
  const uploadedBuffer = useRef(null);
  const recordedBuffer = useRef(null);
  const bufferSourceRef = useRef(null);
  const uploadedBufferSourceRef = useRef(null); // Add ref for the uploaded audio buffer source

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
  };

  const combineAndPlay = async () => {
    if (!uploadedBuffer.current || !recordedBuffer.current) return;

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
    console.log(combinedAudioBuffer);

    const bufferSource = audioContext.current.createBufferSource();
    bufferSource.buffer = combinedBuffer;
    bufferSource.connect(audioContext.current.destination);
    bufferSource.start();
    bufferSourceRef.current = bufferSource;
  };

  const stopCombinedAudio = () => {
    if (bufferSourceRef.current) {
      bufferSourceRef.current.stop();
      bufferSourceRef.current = null;
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

  return (
    <CircleModal isOpen={isOpen} onClose={onClose}>
      {uploadedFile ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
          <Button onClick={e => e.target.previousSibling.click()}>
            Change File
          </Button>
        </div>
      ) : (
        <input type="file" accept="audio/*" onChange={handleFileUpload} />
      )}
      {uploadedFile && (
        <>
          <Button onClick={recording ? stopRecording : startRecording}>
            {recording ? "Stop Recording" : "Start Recording"}
          </Button>
          {recordedAudioURL && (
            <>
              <h3>Recorded Audio:</h3>
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <audio src={recordedAudioURL} controls />
            </>
          )}
          {recordedAudioURL && uploadedFile && (
            <>
              <h3>Combined Audio:</h3>
              <Button onClick={combineAndPlay}>Play Combined Audio</Button>
              <Button onClick={stopCombinedAudio}>Stop Combined Audio</Button>
            </>
          )}
        </>
      )}
      <AudioRecorderStorage
        audioBuffer={combinedAudioBuffer}
        userData={userData}
      />
    </CircleModal>
  );
}

export default AudioRecorder;
