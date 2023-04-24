import React, { useState } from "react";
import axios from "axios";
import * as Tone from "tone";
import { useSelector } from "react-redux";
import toWav from "audiobuffer-to-wav";
import Button from "./common/Button/Button";
import Modal from "./common/Modal/Modal";

async function applyAdjustments(buffer, pitch, tempo) {
  return Tone.Offline(async () => {
    const pitchShift = new Tone.PitchShift(pitch);
    const source = new Tone.BufferSource(buffer).connect(pitchShift);
    source.playbackRate = tempo;
    pitchShift.toDestination();
    source.start(0);
  }, buffer.duration * (1 / tempo));
}

function bufferToWav(buffer) {
  const wavArrayBuffer = toWav(buffer);
  const wavBlob = new Blob([wavArrayBuffer], { type: "audio/wav" });
  return wavBlob;
}

function AudioStorage({ userData, audioPlayedId }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { audioBuffer, pitch, tempo } = useSelector(
    state => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const handleSaveAudio = async () => {
    if (!audioBuffer) return;

    const adjustedBuffer = await applyAdjustments(
      audioBuffer,
      pitch - 1,
      tempo
    );
    const audioBlob = bufferToWav(adjustedBuffer);
    const formData = new FormData();
    formData.append("audio", audioBlob, `${title}.wav`);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("created_at", new Date().toISOString());
    formData.append("userEmail", userData.email);

    try {
      const response = await axios.post(
        "http://localhost:3001/uploadAudio",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.status === 200) {
        console.log("Audio file uploaded successfully");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error uploading audio file:", error);
    }
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Save Audio</Button>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <h3>제목을 입력해주세요</h3>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Title"
        />
        <h3>설명을 입력해 주세요</h3>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <Button onClick={handleSaveAudio}>Save</Button>
      </Modal>
    </div>
  );
}

export default AudioStorage;
