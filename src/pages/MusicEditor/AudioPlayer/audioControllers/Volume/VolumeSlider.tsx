import { useDispatch, useSelector } from "react-redux";
import React, { ChangeEvent, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
import { RootState } from "../../../../../store";
import { setVolume } from "../../../../../feature/audioPlayerSlice";
import StyledVolumeSlider, { VolumeContainer } from "./styles";
import { PropsId } from "../../../../../types";

function VolumeSlider({ audioPlayedId }: PropsId): React.ReactElement {
  const [showSlider, setShowSlider] = useState<boolean>(false);
  const dispatch = useDispatch();

  const audioContext = useSelector(
    (state: RootState) => state.audioContext.audioContext
  );

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(event.target.value);

    if (audioContext && audioContext.gainNode) {
      audioContext.gainNode.gain.value = newVolume;
    }

    dispatch(setVolume({ audioPlayedId, volume: newVolume }));
  };

  const handleMouseEnter = () => {
    setShowSlider(true);
  };

  const handleMouseLeave = () => {
    setShowSlider(false);
  };

  return (
    <VolumeContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <FontAwesomeIcon icon={faVolumeUp} />
      <StyledVolumeSlider
        onChange={handleVolumeChange}
        showSlider={showSlider}
      />
    </VolumeContainer>
  );
}

export default VolumeSlider;
