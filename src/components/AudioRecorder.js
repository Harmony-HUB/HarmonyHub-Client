/* eslint-disable jsx-a11y/media-has-caption */
// AudioRecorder.js
import React, { useState, useEffect, useRef } from "react";
import Button from "./common/Button/Button";
import CircleModal from "./common/Modal/CircleModal";

function AudioRecorder({ isOpen, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [audioPlaybackURL, setAudioPlaybackURL] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);

  const audioRef = useRef();

  const initRecorder = async () => {
    if (!isOpen) return;

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    setMediaRecorder(recorder);

    recorder.addEventListener("dataavailable", e => {
      const url = URL.createObjectURL(e.data);
      setAudioURL(url);
    });
  };

  useEffect(() => {
    initRecorder();
  }, [isOpen]);

  const handleFileUpload = e => {
    const file = e.target.files[0];
    setAudioPlaybackURL(URL.createObjectURL(file));
    setIsAudioReady(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("canplaythrough", () => {
        setIsAudioReady(true);
      });
    }
  }, [audioPlaybackURL]);

  const startRecording = async () => {
    if (mediaRecorder && audioRef.current) {
      try {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              mediaRecorder.start();
              setIsRecording(true);
            })
            .catch(error => {
              console.error("Error starting playback and recording:", error);
            });
        }
      } catch (error) {
        console.error("Error starting playback and recording:", error);
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };
  return (
    <CircleModal isOpen={isOpen} onClose={onClose}>
      <h1>Audio Recorder</h1>
      {!isAudioReady && (
        <input type="file" onChange={handleFileUpload} accept="audio/*" />
      )}
      {audioPlaybackURL && (
        <audio
          ref={audioRef}
          src={audioPlaybackURL}
          style={{ display: "none" }}
        />
      )}
      {isAudioReady && (
        <Button onClick={toggleRecording} disabled={!isAudioReady}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Button>
      )}
      {audioURL && <audio src={audioURL} controls />}
    </CircleModal>
  );
}

export default AudioRecorder;
