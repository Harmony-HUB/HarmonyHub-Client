/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Sidebar from "../../components/common/Sidebar/Sidebar";
import ModalManager from "../../components/common/Modal/ModalManager";
import {
  Editor,
  BottomBar,
  AudioContainer,
  CenteredContent,
  BottomBarHandle,
} from "./styles";
import { Title } from "../../styles";
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
import AudioStorage from "../Storage/AudioStorage";
import { Notes } from "../Login/styles";

function MusicEditor(): React.ReactElement {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isBottomBar, setIsBattomBar] = useState<boolean>(true);

  const dispatch = useDispatch();

  const { audioBuffers, combinedAudioBuffer } = useSelector(
    (state: RootState) => state.musicEditor
  );

  useAudioContext();

  const toggleBottomBar = () => {
    setIsBattomBar(!isBottomBar);
  };
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
    <>
      <Notes />
      <Sidebar />
      <ModalManager />
      <Editor>
        {audioBuffers.length === 0 ? (
          <CenteredContent>
            <Title>Harmony Hub</Title>
            <SelectFile />
          </CenteredContent>
        ) : (
          audioBuffers.map((audioBuffer, index) => {
            if (audioBuffer === null) {
              return null;
            }

            return (
              <AudioContainer>
                <AudioPlayer audioPlayedId={index} audioBuffer={audioBuffer} />
                <MoveAudioPlayer index={index} />
              </AudioContainer>
            );
          })
        )}
      </Editor>
      <BottomBar isBottomBar={isBottomBar}>
        <BottomBarHandle onClick={toggleBottomBar}>
          {isBottomBar ? (
            <FontAwesomeIcon icon={faChevronDown} />
          ) : (
            <FontAwesomeIcon icon={faChevronUp} />
          )}
        </BottomBarHandle>
        {audioBuffers.length > 0 && <SelectFile />}
        {audioBuffers.length >= 2 && <MergeAudio />}
        {combinedAudioBuffer && <Button onClick={openModal}>Save</Button>}
        <Modal isOpen={showModal} onClose={closeModal}>
          <DownloadAudio audioBuffer={combinedAudioBuffer} />
          <AudioStorage audioPlayedId={0} audioBuffer={combinedAudioBuffer} />
        </Modal>
      </BottomBar>
    </>
  );
}

export default MusicEditor;
