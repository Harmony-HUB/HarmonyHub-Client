import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { bufferToWav } from "./utils";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import Spinner from "../../components/common/Spinner/Spinner";
import { AudioRecorderStorageProps } from "./types";
import StyledFormContainer from "./styles";
import { AppDispatch, RootState } from "../../store";
import { uploadAudio } from "../../feature/audioStorageSlice";

function AudioRecorderStorage({ audioBuffer }: AudioRecorderStorageProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isModalOpen = () => {
    setShowModal(!showModal);
  };

  const dispatch = useDispatch<AppDispatch>();

  const userData = useSelector((state: RootState) => state.userData.data);

  const handleSaveAudio = async () => {
    if (!audioBuffer) return;
    setIsLoading(true);

    const audioBlob = bufferToWav(audioBuffer);
    dispatch(uploadAudio({ audioBlob, title, description, userData }));

    setIsLoading(false);
    setShowModal(false);
  };

  return (
    <div>
      <Button onClick={isModalOpen} width="160px" height="65px">
        녹음 음원 저장
      </Button>
      <Modal isOpen={showModal} onClose={isModalOpen}>
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
        <Button width="100px" height="80px" onClick={handleSaveAudio}>
          {isLoading ? <Spinner /> : "Save"}
        </Button>
      </Modal>
    </div>
  );
}

export default AudioRecorderStorage;
