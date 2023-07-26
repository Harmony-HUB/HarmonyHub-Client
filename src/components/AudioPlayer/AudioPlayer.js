import { useEffect } from "react";
import { getContext, Gain, PitchShift } from "tone";
import { useSelector, useDispatch } from "react-redux";
import Waveform from "../Waveform/Waveform.tsx";
import AudioStorage from "../Storage/AudioStorage";
import { AudioPlayerContainer, ButtonContainer } from "./styles";
import {
  setAudioContext,
  setAudioBuffer,
  setSelectedStart,
  setSelectedEnd,
} from "../../feature/audioPlayerSlice.tsx";
import Volume from "../audioControllers/Volume/Volume.tsx";
import Play from "../audioControllers/Play.tsx";
import Stop from "../audioControllers/Stop.tsx";
import Pause from "../audioControllers/Pause.tsx";
import Pitch from "../audioControllers/Pitch.tsx";
import Tempo from "../audioControllers/Tempo.tsx";
import TrimAudio from "../audioControllers/Trim.tsx";

function AudioPlayer({ file, userData, audioPlayedId }) {
  const dispatch = useDispatch();

  const { audioBuffer } = useSelector(
    state => state.audioPlayer.instances[audioPlayedId] || {}
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
    const newAudioContext = getContext();
    const gainNode = new Gain(1).toDestination();
    const pitchShift = new PitchShift(0).connect(gainNode);

    dispatch(
      setAudioContext({
        audioPlayedId,
        audioContext: {
          context: newAudioContext,
          gainNode,
          pitchShift,
        },
      })
    );
  }, [audioPlayedId]);

  return (
    <AudioPlayerContainer data-testid="audio-player-container">
      <Waveform file={file} audioPlayedId={audioPlayedId} />
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
