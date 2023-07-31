import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faPlay } from "@fortawesome/free-solid-svg-icons";
import { StageWrapper, ExplainStage } from "./styles";
import Button from "../../components/common/Button/Button";
import { RootState } from "../../store";
import {
  setCombinedAudioBuffer,
  setAudioSource,
} from "../../feature/recorderSlice";

function MixingStage() {
  const [recordedAudioURL, setRecordedAudioURL] = useState<string | null>(null);
  const [recordedBuffer, setRecorderdBuffer] = useState<AudioBuffer | null>(
    null
  );
  const [playing, setPlaying] = useState(false);

  const dispatch = useDispatch();

  const {
    audioContext,
    audioBuffer,
    uploadedFile,
    recordedChunks,
    audioSource,
  } = useSelector((state: RootState) => state.audioRecorder);

  useEffect(() => {
    if (recordedChunks) {
      const recordedBlob = new Blob(recordedChunks, { type: "audio/webm" });
      const recordedURL = URL.createObjectURL(recordedBlob);
      setRecordedAudioURL(recordedURL);
      const reader = new FileReader();
      reader.onload = async e => {
        if (e.target !== null) {
          const arrayBuffer = e.target.result;
          if (!audioContext || !arrayBuffer) return;
          const newAudioBuffer = await audioContext.decodeAudioData(
            arrayBuffer as ArrayBuffer
          );
          setRecorderdBuffer(newAudioBuffer);
        }
      };

      reader.readAsArrayBuffer(recordedBlob);
    }
  }, [recordedChunks]);

  const togglePlayStop = async () => {
    if (!audioBuffer || !recordedBuffer) return;

    if (!playing && audioContext) {
      const combinedBuffer = new AudioBuffer({
        length: Math.max(audioBuffer.length, recordedBuffer.length),
        numberOfChannels: 2,
        sampleRate: audioContext.sampleRate,
      });

      combinedBuffer.copyToChannel(audioBuffer.getChannelData(0), 0);
      combinedBuffer.copyToChannel(recordedBuffer.getChannelData(0), 1);

      dispatch(setCombinedAudioBuffer(combinedBuffer));

      const bufferSource = audioContext.createBufferSource();

      bufferSource.buffer = combinedBuffer;
      bufferSource.connect(audioContext.destination);
      bufferSource.start();
      dispatch(setAudioSource(bufferSource));

      setPlaying(true);
    } else if (audioSource) {
      audioSource.stop();
      dispatch(setAudioSource(null));
      setPlaying(false);
    }
  };

  return (
    <StageWrapper>
      <ExplainStage>녹음된 음원 재생하기</ExplainStage>
      {recordedAudioURL && uploadedFile && (
        <Button onClick={togglePlayStop}>
          <FontAwesomeIcon icon={playing ? faStop : faPlay} />
        </Button>
      )}
    </StageWrapper>
  );
}

export default MixingStage;
