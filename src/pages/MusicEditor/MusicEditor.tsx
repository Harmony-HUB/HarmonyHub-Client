/* eslint-disable react/jsx-key */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Gain, PitchShift } from "tone";
import { Editor, BottomBar, AudioContainer } from "./styles";
import AudioPlayer from "./AudioPlayer/AudioPlayer";
import Button from "../../components/common/Button/Button";
import DownloadAudio from "../Storage/DownloadAudio";
import Modal from "../../components/common/Modal/Modal";
import MergeAudio from "./MergeAudio";
import SelectFile from "./SelectFile";
import MoveAudioPlayer from "./MoveAudioPlayer";
import { setAudioContext } from "../../feature/audioContextSlice";
import { UserData } from "../../types";
import { RootState } from "../../store";
import { setAudioBuffers } from "../../feature/musicEditorSlice";

interface MusicEditorProps {
  userData: UserData;
}

function MusicEditor({ userData }: MusicEditorProps): React.ReactElement {
  const [showModal, setShowModal] = useState<boolean>(false);

  const dispatch = useDispatch();
  const audioContext = new AudioContext();

  const { audioBuffers, combinedAudioBuffer } = useSelector(
    (state: RootState) => state.musicEditor
  );

  useEffect(() => {
    const gainNode = new Gain(1).toDestination();
    const pitchShift = new PitchShift(0).connect(gainNode);

    dispatch(
      setAudioContext({
        audioContext: {
          context: audioContext,
          gainNode,
          pitchShift,
        },
      })
    );
  }, []);

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
              userData={userData}
              audioPlayedId={index}
              audioBuffer={audioBuffer}
            />
            <MoveAudioPlayer index={index} />
          </AudioContainer>
        );
      })}
      <BottomBar>
        <SelectFile />
        <MergeAudio />
        <Button onClick={openModal}>Save</Button>
        {showModal && (
          <Modal isOpen={showModal} onClose={closeModal}>
            <DownloadAudio audioBuffer={combinedAudioBuffer} />
          </Modal>
        )}
      </BottomBar>
    </Editor>
  );
}

export default MusicEditor;
