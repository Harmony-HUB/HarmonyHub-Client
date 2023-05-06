/* eslint-disable no-undef */
import { render, fireEvent } from "@testing-library/react";
import Controls from "../../src/components/AudioPlayer/Control";

describe("Controls component", () => {
  it("calls the respective functions when buttons are clicked", () => {
    const playSound = jest.fn();
    const pauseSound = jest.fn();
    const stopSound = jest.fn();
    const handlePitchChange = jest.fn();
    const handleTempoChange = jest.fn();
    const handleVolumeChange = jest.fn();

    const { getByTestId } = render(
      <Controls
        playSound={playSound}
        pauseSound={pauseSound}
        stopSound={stopSound}
        handlePitchChange={handlePitchChange}
        handleTempoChange={handleTempoChange}
        handleVolumeChange={handleVolumeChange}
      />
    );

    fireEvent.click(getByTestId("play-button"));
    expect(playSound).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId("pause-button"));
    expect(pauseSound).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId("stop-button"));
    expect(stopSound).toHaveBeenCalledTimes(1);

    fireEvent.click(getByTestId("pitch-down-button"));
    expect(handlePitchChange).toHaveBeenCalledWith(-0.1);

    fireEvent.click(getByTestId("pitch-up-button"));
    expect(handlePitchChange).toHaveBeenCalledWith(0.1);

    fireEvent.click(getByTestId("tempo-down-button"));
    expect(handleTempoChange).toHaveBeenCalledWith(-0.1);

    fireEvent.click(getByTestId("tempo-up-button"));
    expect(handleTempoChange).toHaveBeenCalledWith(0.1);
  });
});
