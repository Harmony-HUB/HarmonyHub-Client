/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Editor, BottomBar, AudioContainer } from "./styles";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Button from "../../components/common/Button/Button";
import DownloadAudio from "../Storage/DownloadAudio";
import Modal from "../../components/common/Modal/Modal";
import MergeAudio from "./MergeAudio";
import SelectFile from "./SelectFile";
import MoveAudioPlayer from "./MoveAudioPlayer";
import { RootState } from "../../store";
import { setAudioBuffers } from "../../feature/musicEditorSlice";
import useAudioContext from "../../hooks/useAudioContext";

function MusicEditor(): React.ReactElement {
  const [showModal, setShowModal] = useState<boolean>(false);

  const dispatch = useDispatch();

  const { audioBuffers, combinedAudioBuffer } = useSelector(
    (state: RootState) => state.musicEditor
  );

  useAudioContext();

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (combinedAudioBuffer) {
      dispatch(setAudioBuffers([combinedAudioBuffer]));
    }
  }, [combinedAudioBuffer]);

  return (
    <Editor>
      {audioBuffers.map((audioBuffer, index) => {
        if (audioBuffer === null) {
          return null;
        }

        return (
          <AudioContainer>
            <AudioPlayer
              // userData={userData}
              audioPlayedId={index}
              audioBuffer={audioBuffer}
            />
            <MoveAudioPlayer index={index} />
          </AudioContainer>
        );
      })}
      <BottomBar>
        <SelectFile />
        {audioBuffers.length >= 2 && <MergeAudio />}
        {audioBuffers.length > 1 && <Button onClick={openModal}>Save</Button>}
        <Modal isOpen={showModal} onClose={closeModal}>
          <DownloadAudio audioBuffer={combinedAudioBuffer} />
        </Modal>
      </BottomBar>
    </Editor>
  );
}

export default MusicEditor;
