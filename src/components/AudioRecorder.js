/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from "react";
import Button from "./common/Button/Button";
import CircleModal from "./common/Modal/CircleModal";
import AudioStorage from "./AudioStorage";

function AudioRecorder({ isOpen, onClose }) {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState("");
  const [audioPlaybackURL, setAudioPlaybackURL] = useState(null);
  const [isAudioReady, setIsAudioReady] = useState(false);
  const [bufferSource, setBufferSource] = useState(null);
  const [finalAudioURL, setFinalAudioURL] = useState(null);

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

  const mergeAudio = async (audio1Url, audio2Url) => {
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    const fetchAudio1 = fetch(audio1Url).then(response =>
      response.arrayBuffer()
    );
    const fetchAudio2 = fetch(audio2Url).then(response =>
      response.arrayBuffer()
    );

    const [audio1Buffer, audio2Buffer] = await Promise.all([
      fetchAudio1,
      fetchAudio2,
    ]);
    const audio1Decoded = await audioContext.decodeAudioData(audio1Buffer);
    const audio2Decoded = await audioContext.decodeAudioData(audio2Buffer);

    const duration = Math.max(audio1Decoded.duration, audio2Decoded.duration);
    const maxChannels = Math.max(
      audio1Decoded.numberOfChannels,
      audio2Decoded.numberOfChannels
    );
    const mergedBuffer = audioContext.createBuffer(
      maxChannels,
      audioContext.sampleRate * duration,
      audioContext.sampleRate
    );

    for (let channel = 0; channel < maxChannels; channel += 1) {
      const channelData = mergedBuffer.getChannelData(channel);
      const channelData1 =
        audio1Decoded.numberOfChannels > channel
          ? audio1Decoded.getChannelData(channel)
          : new Float32Array(mergedBuffer.length);
      const channelData2 =
        audio2Decoded.numberOfChannels > channel
          ? audio2Decoded.getChannelData(channel)
          : new Float32Array(mergedBuffer.length);
      for (let i = 0; i < channelData.length; i += 1) {
        channelData[i] = channelData1[i] + (channelData2[i] || 0);
      }
    }

    const newBufferSource = audioContext.createBufferSource(); // Renamed variable
    newBufferSource.buffer = mergedBuffer;
    newBufferSource.connect(audioContext.destination);

    setBufferSource(newBufferSource); // Updated function call
  };

  const handleFileUpload = e => {
    const file = e.target.files[0];
    setAudioPlaybackURL(URL.createObjectURL(file));
    setIsAudioReady(false);
  };

  const handleBackgroundAudioEnded = () => {
    if (!finalAudioURL) {
      bufferSource.exportBuffer().then(mergedAudioBuffer => {
        const mergedAudioBlob = new Blob([mergedAudioBuffer], {
          type: "audio/mpeg",
        });
        setFinalAudioURL(URL.createObjectURL(mergedAudioBlob));
      });
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("canplaythrough", () => {
        setIsAudioReady(true);
      });

      audioRef.current.addEventListener("ended", handleBackgroundAudioEnded);
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
      mediaRecorder.addEventListener("dataavailable", async e => {
        const recordedAudioBlob = e.data;
        const recordedAudioUrl = URL.createObjectURL(recordedAudioBlob);

        if (audioPlaybackURL) {
          await mergeAudio(audioPlaybackURL, recordedAudioUrl);
        } else {
          setAudioURL(recordedAudioUrl);
        }
      });

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
      {finalAudioURL ? (
        <audio
          src={finalAudioURL}
          controls
          onPlay={() => {
            if (bufferSource) {
              bufferSource.start(0);
            }
          }}
        />
      ) : (
        audioURL && <audio src={audioURL} controls />
      )}

      <AudioStorage recordedAudioURL={audioURL} />
    </CircleModal>
  );
}

export default AudioRecorder;
