/* eslint-disable react/button-has-type */
import React from "react";
import { useDispatch } from "react-redux";
import {
  playSelectedAudioPlayer,
  pauseSelectedAudioPlayer,
  stopSelectedAudioPlayer,
} from "../feature/audioPlayerSlice";

function AudioController() {
  const dispatch = useDispatch();

  const handlePlay = () => {
    dispatch(playSelectedAudioPlayer());
  };

  const handlePause = () => {
    dispatch(pauseSelectedAudioPlayer());
  };

  const handleStop = () => {
    dispatch(stopSelectedAudioPlayer());
  };

  return (
    <div>
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}

export default AudioController;
