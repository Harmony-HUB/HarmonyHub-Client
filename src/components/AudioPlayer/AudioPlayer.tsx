import { useEffect } from "react";
import { Gain, PitchShift } from "tone";
import { useSelector, useDispatch } from "react-redux";
import Waveform from "../Waveform/Waveform";
import AudioStorage from "../Storage/AudioStorage";
import { AudioPlayerContainer, ButtonContainer } from "./styles";
import {
  setAudioContext,
  setAudioBuffer,
  setSelectedStart,
  setSelectedEnd,
} from "../../feature/audioPlayerSlice";
import Volume from "../audioControllers/Volume/Volume";
import Play from "../audioControllers/Play";
import Stop from "../audioControllers/Stop";
import Pause from "../audioControllers/Pause";
import Pitch from "../audioControllers/Pitch";
import Tempo from "../audioControllers/Tempo";
import TrimAudio from "../audioControllers/Trim";
import { RootState } from "../../store";

interface AudioPlayerProps {
  file: string;
  userData: string;
  audioPlayedId: number;
}

function AudioPlayer({
  file,
  userData,
  audioPlayedId,
}: AudioPlayerProps): React.ReactElement {
  const dispatch = useDispatch();

  const { audioBuffer } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const audioContext = new AudioContext();

  useEffect(() => {
    if (!file) return;

    const loadAudioFile = async () => {
      try {
        const response = await fetch(file);
        const audioData = await response.arrayBuffer();
        const newAudioBuffer = await audioContext.decodeAudioData(audioData);
        dispatch(
          setAudioBuffer({ audioPlayedId, audioBuffer: newAudioBuffer })
        );
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.error(error);
        }
      }
    };

    loadAudioFile();
  }, [file]);

  useEffect(() => {
    dispatch(setSelectedStart({ audioPlayedId, selectedStart: 0 }));
    dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: 1 }));
  }, []);

  useEffect(() => {
    const gainNode = new Gain(1).toDestination();
    const pitchShift = new PitchShift(0).connect(gainNode);

    dispatch(
      setAudioContext({
        audioPlayedId,
        audioContext: {
          context: audioContext,
          gainNode,
          pitchShift,
        },
      })
    );
  }, [audioPlayedId]);

  return (
    <AudioPlayerContainer data-testid="audio-player-container">
      <Waveform audioPlayedId={audioPlayedId} />
      <Play audioPlayedId={audioPlayedId} />
      <Stop audioPlayedId={audioPlayedId} />
      <Volume audioPlayedId={audioPlayedId} />
      <Pause audioPlayedId={audioPlayedId} />
      <Pitch audioPlayedId={audioPlayedId} />
      <Tempo audioPlayedId={audioPlayedId} />
      <TrimAudio audioPlayedId={audioPlayedId} />
      <ButtonContainer>
        <AudioStorage
          audioPlayedId={audioPlayedId}
          userData={userData}
          audioBuffer={audioBuffer}
        />
      </ButtonContainer>
    </AudioPlayerContainer>
  );
}
export default AudioPlayer;
