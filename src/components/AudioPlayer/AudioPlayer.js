import { useEffect, useState } from "react";
import { getContext, Gain, PitchShift } from "tone";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
import Waveform from "../Waveform/Waveform";
import AudioStorage from "../Storage/AudioStorage";
import { AudioPlayerContainer, ButtonContainer } from "./styles";
import Button from "../common/Button/Button.tsx";
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

function AudioPlayer({ file, cutWaveformBuffer, userData, audioPlayedId }) {
  const [isTrimmed, setIsTrimmed] = useState(false);

  const { audioBuffer, audioContext, volume, selectedEnd, selectedStart } =
    useSelector(state => state.audioPlayer.instances[audioPlayedId] || {});

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSelectedStart({ audioPlayedId, selectedStart: 0 }));
    dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: 1 }));
  }, []);

  useEffect(() => {
    if (cutWaveformBuffer) {
      dispatch(
        setAudioBuffer({
          audioPlayedId,
          audioBuffer: cutWaveformBuffer,
        })
      );
      setIsTrimmed(true);
    }
  }, [cutWaveformBuffer]);

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

  const copyAudioChannelData = (
    oldBuffer,
    newBuffer,
    channel,
    startRatio,
    endRatio
  ) => {
    const oldChannelData = oldBuffer.getChannelData(channel);
    const newChannelData = newBuffer.getChannelData(channel);

    const startSample = Math.floor(startRatio * oldChannelData.length);
    const endSample = Math.floor(endRatio * oldChannelData.length);

    for (let i = startSample, j = 0; i < endSample; i += 1, j += 1) {
      newChannelData[j] = oldChannelData[i];
    }
  };

  const trimAudioBuffer = () => {
    if (!audioBuffer || audioBuffer.duration <= 1) return;

    const newBuffer = audioContext.context.createBuffer(
      audioBuffer.numberOfChannels,
      Math.floor((selectedEnd - selectedStart) * audioBuffer.length),
      audioBuffer.sampleRate
    );

    for (
      let channel = 0;
      channel < audioBuffer.numberOfChannels;
      channel += 1
    ) {
      copyAudioChannelData(
        audioBuffer,
        newBuffer,
        channel,
        selectedStart,
        selectedEnd
      );
    }

    dispatch(setAudioBuffer({ audioPlayedId, audioBuffer: newBuffer }));
    dispatch(setSelectedStart({ audioPlayedId, selectedStart: 0 }));
    dispatch(setSelectedEnd({ audioPlayedId, selectedEnd: 1 }));
    setIsTrimmed(true);
  };

  return (
    <AudioPlayerContainer data-testid="audio-player-container">
      <Waveform
        file={file}
        waveformColor="#b3ecec"
        isTrimmed={isTrimmed}
        audioPlayedId={audioPlayedId}
        volume={volume}
      />
      <Play audioPlayedId={audioPlayedId} />
      <Stop audioPlayedId={audioPlayedId} />
      <Volume audioPlayedId={audioPlayedId} />
      <Pause audioPlayedId={audioPlayedId} />
      <Pitch audioPlayedId={audioPlayedId} />
      <Tempo audioPlayedId={audioPlayedId} />
      <ButtonContainer>
        <Button data-testid="trim-button" onClick={trimAudioBuffer}>
          <FontAwesomeIcon icon={faScissors} />
        </Button>
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
