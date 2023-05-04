import React, { useState } from "react";
import axios from "axios";
import * as Tone from "tone";
import { useSelector } from "react-redux";
import toWav from "audiobuffer-to-wav";
import styled from "styled-components";
import Button from "../common/Button/Button";
import Modal from "../common/Modal/Modal";
import Spinner from "../common/Spinner";

const StyledFormContainer = styled.div`
  display: flex;
  flex-direction: column;

  h3 {
    margin-bottom: 8px;
  }

  input,
  textarea {
    margin-bottom: 16px;
  }
`;

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

function AudioStorage({ audioBuffer, userData, audioPlayedId }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const isModalOpen = () => {
    setShowModal(true);
  };

  const { pitch, tempo } = useSelector(
    state => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const handleSaveAudio = async () => {
    if (!audioBuffer) return;

    setLoading(true);

    const adjustedPitch = pitch !== undefined ? pitch - 1 : 0;
    const adjustedTempo = tempo !== undefined ? tempo : 1;

    const adjustedBuffer = await applyAdjustments(
      audioBuffer,
      adjustedPitch,
      adjustedTempo
    );

    if (!adjustedBuffer) {
      console.error("Error applying adjustments to audio buffer.");
      return;
    }

    const audioBlob = bufferToWav(adjustedBuffer);
    const formData = new FormData();
    formData.append("audio", audioBlob, `${title}.wav`);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("created_at", new Date().toISOString());
    formData.append("userEmail", userData.email);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        "http://localhost:3001/uploadAudio",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("Audio file uploaded successfully");
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error uploading audio file:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {userData?.email && <Button onClick={isModalOpen}>저장</Button>}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <StyledFormContainer>
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
        </StyledFormContainer>
        <Button onClick={handleSaveAudio}>
          {loading ? <Spinner /> : "Save"}
        </Button>
      </Modal>
    </div>
  );
}

export default AudioStorage;
