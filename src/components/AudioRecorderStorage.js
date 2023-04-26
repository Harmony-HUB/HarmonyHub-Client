import React, { useState } from "react";
import axios from "axios";
import toWav from "audiobuffer-to-wav";
import Button from "./common/Button/Button";
import Modal from "./common/Modal/Modal";

function bufferToWav(buffer) {
  const wavArrayBuffer = toWav(buffer);
  const wavBlob = new Blob([wavArrayBuffer], { type: "audio/wav" });
  return wavBlob;
}

function AudioRecorderStorage({ audioBuffer, userData }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSaveAudio = async () => {
    if (!audioBuffer) return;

    const audioBlob = bufferToWav(audioBuffer);
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

export default AudioRecorderStorage;
