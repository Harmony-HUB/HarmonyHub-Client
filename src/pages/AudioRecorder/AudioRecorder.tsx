import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SelectStage from "./SelectStage";
import RecordStage from "./RecordStage";
import MixingStage from "./MixingStage";
import { setAudioContext } from "../../feature/recorderSlice";
import { RootState } from "../../store";
import AudioRecorderStorage from "../Storage/AudioRecorderStorage";

function AudioRecorder() {
  const dispatch = useDispatch();

  useEffect(() => {
    const audioContext = new AudioContext();
    dispatch(setAudioContext(audioContext));
  }, []);

  const { stage, combinedAudioBuffer } = useSelector(
    (state: RootState) => state.audioRecorder
  );

  return (
    <div>
      {stage === 1 && <SelectStage />}
      {stage === 2 && <RecordStage />}
      {stage === 3 && <MixingStage />}
      {stage === 4 && (
        <AudioRecorderStorage
          // userData={userData}
          audioBuffer={combinedAudioBuffer}
        />
      )}
    </div>
  );
}

export default AudioRecorder;
