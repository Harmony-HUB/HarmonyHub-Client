import { useState, useRef, useEffect } from "react";
import { faStop, faPlay } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setAudioContext } from "../../feature/recorderSlice.ts";
import Button from "../../components/common/Button/Button.tsx";
import AudioRecorderStorage from "../Storage/AudioRecorderStorage.tsx";
import { StageWrapper, ExplainStage } from "./styles.tsx";
import SelectStage from "./SelectStage.tsx";
import RecordStage from "./RecordStage.tsx";

function AudioRecorder({ userData }) {
  const [recordedAudioURL, setRecordedAudioURL] = useState(null);
  const [combinedAudioBuffer, setCombinedAudioBuffer] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [recordedBuffer, setRecorderdBuffer] = useState(null);

  const bufferSourceRef = useRef(null);
  const audioContext = new AudioContext();
  const dispatch = useDispatch();

  const { audioBuffer, uploadedFile, recordedChunks, stage } = useSelector(
    state => state.audioRecorder
  );

  useEffect(() => {
    dispatch(setAudioContext(audioContext));
  }, []);

  useEffect(() => {
    if (recordedChunks) {
      const recordedBlob = new Blob(recordedChunks, { type: "audio/webm" });
      const recordedURL = URL.createObjectURL(recordedBlob);
      setRecordedAudioURL(recordedURL);
      const reader = new FileReader();
      reader.onload = async e => {
        const arrayBuffer = e.target.result;
        const newAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        setRecorderdBuffer(newAudioBuffer);
      };
      reader.readAsArrayBuffer(recordedBlob);
    }
  }, [recordedChunks]);

  const togglePlayStop = async () => {
    if (!audioBuffer || !recordedBuffer) return;

    if (!playing) {
      const combinedBuffer = new AudioBuffer({
        length: Math.max(audioBuffer.length, recordedBuffer.length),
        numberOfChannels: 2,
        sampleRate: audioContext.sampleRate,
      });

      combinedBuffer.copyToChannel(audioBuffer.getChannelData(0), 0);
      combinedBuffer.copyToChannel(recordedBuffer.getChannelData(0), 1);

      setCombinedAudioBuffer(combinedBuffer);

      const bufferSource = audioContext.createBufferSource();

      bufferSource.buffer = combinedBuffer;
      bufferSource.connect(audioContext.destination);
      bufferSource.start();
      bufferSourceRef.current = bufferSource;

      setPlaying(true);
    } else if (bufferSourceRef.current) {
      bufferSourceRef.current.stop();
      bufferSourceRef.current = null;
      setPlaying(false);
    }
  };

  return (
    <div>
      {stage === 1 && <SelectStage />}
      {stage === 2 && <RecordStage />}
      {stage === 3 && (
        <StageWrapper>
          <ExplainStage>녹음된 음원 재생하기</ExplainStage>
          {recordedAudioURL && uploadedFile && (
            <Button onClick={togglePlayStop}>
              <FontAwesomeIcon icon={playing ? faStop : faPlay} />
            </Button>
          )}
          <AudioRecorderStorage
            audioBuffer={combinedAudioBuffer}
            userData={userData}
          />
        </StageWrapper>
      )}
    </div>
  );
}

export default AudioRecorder;
