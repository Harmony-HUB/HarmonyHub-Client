/* eslint-disable no-await-in-loop */
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Gain, PitchShift } from "tone";
import { Editor, BottomBar } from "./styles";
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

interface MusicEditorProps {
  userData: UserData;
}

interface FileObject {
  file: string;
  isUploaded: boolean;
}

interface AudioBufferWithKey {
  key: number;
  buffer: AudioBuffer;
}

function MusicEditor({ userData }: MusicEditorProps): React.ReactElement {
  const [showModal, setShowModal] = useState(false);
  const [audioBuffers, setAudioBuffers] = useState<AudioBufferWithKey[]>([]);

  const dispatch = useDispatch();
  const audioContext = new AudioContext();

  const combinedAudioBuffer = useSelector(
    (state: RootState) => state.musicEditor.combinedAudioBuffer
  );
  const audioFiles = useSelector(
    (state: RootState) => state.musicEditor.audioFiles
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

  const loadAudioFile = async (file: FileObject) => {
    try {
      const response = await fetch(file.file);
      const audioData = await response.arrayBuffer();
      const newAudioBuffer = await audioContext.decodeAudioData(audioData);

      return { key: Date.now(), buffer: newAudioBuffer };
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      return null;
    }
  };

  useEffect(() => {
    const loadAllFiles = async () => {
      const newAudioBuffers: AudioBufferWithKey[] = [];

      for (let i = 0; i < audioFiles.length; i += 1) {
        const newBuffer = await loadAudioFile(audioFiles[i]);

        if (newBuffer) {
          newAudioBuffers.push(newBuffer);
        }
      }

      setAudioBuffers(newAudioBuffers);
    };

    loadAllFiles();
  }, [audioFiles]);

  useEffect(() => {
    if (combinedAudioBuffer) {
      setAudioBuffers([{ key: 0, buffer: combinedAudioBuffer }]);
    }
  }, [combinedAudioBuffer]);

  return (
    <Editor>
      {audioBuffers.map((audioBuffer: AudioBufferWithKey, index) => (
        <AudioPlayer
          userData={userData}
          audioPlayedId={index}
          audioBuffer={audioBuffer.buffer}
          key={audioBuffer.key}
        />
      ))}
      <MoveAudioPlayer />
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
