import { useDispatch, useSelector } from "react-redux";
import { faScissors } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropsId from "./types";
import Button from "../common/Button/Button";
import {
  setSelectedEnd,
  setSelectedStart,
  setAudioBuffer,
} from "../../feature/audioPlayerSlice";
import { setIsTrimmed } from "../../feature/audioStatusSlice";
import { RootState } from "../../store";

function TrimAudio({ audioPlayedId }: PropsId): React.ReactElement {
  const dispatch = useDispatch();

  const { audioBuffer, selectedStart, selectedEnd } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );
  const audioContext = useSelector(
    (state: RootState) => state.audioContext.audioContext
  );

  const copyAudioChannelData = (
    oldBuffer: AudioBuffer,
    newBuffer: AudioBuffer,
    channel: number,
    startRatio: number,
    endRatio: number
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

    if (!audioContext) return;
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
    dispatch(setIsTrimmed({ audioPlayedId, isTrimmed: true }));
  };

  return (
    <div>
      <Button onClick={trimAudioBuffer}>
        <FontAwesomeIcon icon={faScissors} />
      </Button>
    </div>
  );
}

export default TrimAudio;
