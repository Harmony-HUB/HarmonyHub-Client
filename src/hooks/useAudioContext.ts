import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Gain, PitchShift } from "tone";
import { setAudioContext } from "../feature/audioContextSlice";

function useAudioContext() {
  const dispatch = useDispatch();
  const audioContext = new AudioContext();

  useEffect(() => {
    const gainNode = new Gain(1).toDestination();
    const pitchShift = new PitchShift(0).connect(gainNode);

    dispatch(
      setAudioContext({
        audioContext: {
          context: audioContext,
          gainNode,
          pitchShift,
        },
      })
    );
  }, [dispatch]);

  return audioContext;
}

export default useAudioContext;
