import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SelectStage from "./SelectStage";
import RecordStage from "./RecordStage";
import MixingStage from "./MixingStage";
import { setAudioContext } from "../../feature/recorderSlice";
import { RootState } from "../../store";
import AudioRecorderStorage from "../Storage/AudioRecorderStorage";
import Sidebar from "../../components/common/Sidebar/Sidebar";

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
      <Sidebar />
      {stage === 1 && <SelectStage />}
      {stage === 2 && <RecordStage />}
      {stage === 3 && <MixingStage />}
      {stage === 4 && (
        <AudioRecorderStorage audioBuffer={combinedAudioBuffer} />
      )}
    </div>
  );
}

export default AudioRecorder;
