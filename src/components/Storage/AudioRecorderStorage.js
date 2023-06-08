import React, { useState } from "react";
import axios from "axios";
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

function bufferToWav(buffer) {
  const wavArrayBuffer = toWav(buffer);
  const wavBlob = new Blob([wavArrayBuffer], { type: "audio/wav" });
  return wavBlob;
}

function AudioRecorderStorage({ audioBuffer, userData }) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveAudio = async () => {
    if (!audioBuffer) return;

    setLoading(true);

    const audioBlob = bufferToWav(audioBuffer);
    const formData = new FormData();
    formData.append("audio", audioBlob, `${title}.wav`);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("created_at", new Date().toISOString());
    formData.append("userEmail", userData.email);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/uploadAudio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setShowModal(false);
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("업로드 도중 오류가 발생했습니다.", error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={() => setShowModal(true)}>Save Audio</Button>
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
          <Button onClick={handleSaveAudio}>
            {loading ? <Spinner /> : "Save"}
          </Button>
        </StyledFormContainer>
      </Modal>
    </div>
  );
}

export default AudioRecorderStorage;
