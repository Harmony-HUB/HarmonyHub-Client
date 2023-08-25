import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import SelectStage from "./SelectStage";
import RecordStage from "./RecordStage";
import MixingStage from "./MixingStage";
import { setAudioContext } from "../../feature/recorderSlice";
import { RootState } from "../../store";
import Sidebar from "../../components/common/Sidebar/Sidebar";
import { Notes } from "../Login/styles";

function AudioRecorder() {
  const dispatch = useDispatch();

  useEffect(() => {
    const audioContext = new AudioContext();
    dispatch(setAudioContext(audioContext));
  }, []);

  const { stage } = useSelector((state: RootState) => state.audioRecorder);

  return (
    <>
      <Notes />
      <Sidebar />
      {stage === 1 && <SelectStage />}
      {stage === 2 && <RecordStage />}
      {stage === 3 && <MixingStage />}
    </>
  );
}

export default AudioRecorder;
