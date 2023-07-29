import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import Spinner from "../../components/common/Spinner/Spinner";
import refreshAccessToken from "../../components/Auth/refreshAccessToken";
import { RootState } from "../../store";
import { AudioStorageProps } from "./types";
import {
  applyAdjustments,
  bufferToWav,
  toneAudioBufferToAudioBuffer,
} from "./utils";

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

function AudioStorage({
  audioBuffer,
  userData,
  audioPlayedId,
}: AudioStorageProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const isModalOpen = () => {
    setShowModal(true);
  };

  const { pitch, tempo } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
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

    const buffer = toneAudioBufferToAudioBuffer(adjustedBuffer);
    const audioBlob = bufferToWav(buffer);
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
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 401) {
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
