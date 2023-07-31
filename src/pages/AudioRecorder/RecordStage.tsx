import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStop, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { RecordButton, StageWrapper, ExplainStage } from "./styles";
import { RootState } from "../../store";
import {
  setAudioSource,
  setRecordedChunks,
  setIsRecord,
  setStage,
} from "../../feature/recorderSlice";

function RecordStage() {
  const [mediaRecorderInstance, setMediaRecorder] =
    useState<MediaRecorder | null>(null);

  const dispatch = useDispatch();

  const { audioContext, audioBuffer, audioSource, isRecored, recordedChunks } =
    useSelector((state: RootState) => state.audioRecorder);

  const startRecording = async () => {
    console.log(audioContext);
    if (audioContext) {
      const bufferSource = audioContext.createBufferSource();
      bufferSource.buffer = audioBuffer;
      bufferSource.connect(audioContext.destination);
      bufferSource.start();

      dispatch(setAudioSource(bufferSource));
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream);
    setMediaRecorder(newMediaRecorder);

    newMediaRecorder.ondataavailable = e => {
      if (e.data.size > 0) {
        dispatch(setRecordedChunks([...(recordedChunks || []), e.data]));
      }
    };

    newMediaRecorder.start();
    dispatch(setIsRecord(true));
  };

  const stopRecording = () => {
    if (mediaRecorderInstance) {
      mediaRecorderInstance.stop();
      dispatch(setIsRecord(false));
    }

    if (audioSource) {
      audioSource.stop();
      dispatch(setAudioSource(null));
    }

    dispatch(setStage(3));
  };

  return (
    <StageWrapper>
      <ExplainStage>마이크 버튼을 누르면 음악이 재생됩니다.</ExplainStage>
      <RecordButton onClick={isRecored ? stopRecording : startRecording}>
        <FontAwesomeIcon icon={isRecored ? faStop : faMicrophone} />
      </RecordButton>
    </StageWrapper>
  );
}

export default RecordStage;
