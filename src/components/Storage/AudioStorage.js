import React, { useState } from "react";
import axios from "axios";
import * as Tone from "tone";
import { useSelector } from "react-redux";
import toWav from "audiobuffer-to-wav";
import styled from "styled-components";
import Button from "../common/Button/Button.tsx";
import Modal from "../common/Modal/Modal";
import Spinner from "../common/Spinner";
import refreshAccessToken from "../Auth/refreshAccessToken";

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
  return Tone.Offline(
    async () => {
      const pitchShift = new Tone.PitchShift(pitch);
      const source = new Tone.BufferSource(buffer).connect(pitchShift);
      source.playbackRate = tempo;
      pitchShift.toDestination();
      source.start(0);
    },
    buffer.duration * (1 / tempo)
  );
}

export function bufferToWav(buffer) {
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
      if (process.env.NODE_ENV !== "production") {
        console.error("오디오 버퍼에 조정을 적용하는 중 오류가 발생했습니다.");
      }
      return;
    }

    const audioBlob = bufferToWav(adjustedBuffer);
    const formData = new FormData();
    formData.append("audio", audioBlob, `${title}.wav`);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("created_at", new Date().toISOString());
    formData.append("userEmail", userData.email);

    let newToken;
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
      if (error.response && error.response.status === 401) {
        newToken = await refreshAccessToken();

        if (!newToken) {
          if (process.env.NODE_ENV !== "production") {
            console.error("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
          }
          return;
        }
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/uploadAudio`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${newToken}`,
            },
          }
        );

        if (response.status === 200) {
          if (process.env.NODE_ENV !== "production") {
            console.log("오디오 파일이 성공적으로 업로드 됐습니다.");
          }
          setShowModal(false);
        }
      } catch (retryError) {
        if (process.env.NODE_ENV !== "production") {
          console.error(
            "액세스 토큰을 새로 고친 후 오디오 파일을 업로드하는 동안 오류가 발생했습니다.",
            retryError
          );
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {userData.email && <Button onClick={isModalOpen}>저장</Button>}
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
