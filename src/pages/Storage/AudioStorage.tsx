import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import Spinner from "../../components/common/Spinner/Spinner";
import { AppDispatch, RootState } from "../../store";
import { AudioStorageProps } from "./types";
import {
  applyAdjustments,
  bufferToWav,
  toneAudioBufferToAudioBuffer,
} from "./utils";
import StyledFormContainer from "./styles";
import { uploadAudio } from "../../feature/audioStorageSlice";

function AudioStorage({ audioBuffer, audioPlayedId }: AudioStorageProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const dispatch = useDispatch<AppDispatch>();

  const { uploading } = useSelector((state: RootState) => state.audioStorage);
  const userData = useSelector((state: RootState) => state.userData.data);

  const isModalOpen = () => {
    setShowModal(true);
  };

  const { pitch, tempo } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const handleSaveAudio = async () => {
    if (!audioBuffer) return;

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

    dispatch(uploadAudio({ audioBlob, title, description, userData }));

    setShowModal(false);
  };

  return (
    <div>
      <Button onClick={isModalOpen}>저장</Button>
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
          {uploading ? <Spinner /> : "Save"}
        </Button>
      </Modal>
    </div>
  );
}

export default AudioStorage;
