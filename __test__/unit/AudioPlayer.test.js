import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import AudioPlayer from "../../src/components/AudioPlayer/AudioPlayer";

window.AudioContext = require("../__mocks__/audioContext").default;

const mockStore = configureMockStore();
const store = mockStore({
  audioPlayer: {
    instances: {},
  },
});

describe("AudioPlayer", () => {
  let container;

  beforeEach(() => {
    const { container: renderContainer } = render(
      <Provider store={store}>
        <AudioPlayer
          file={null}
          cutWaveformBuffer={null}
          userData={null}
          audioPlayedId="test-id"
        />
      </Provider>
    );
    container = renderContainer;
  });

  test("컴포넌트가 렌더링 됩니다.", () => {
    expect(screen.getByTestId("audio-player-container")).toBeInTheDocument();
  });

  test("handleVolumeChange function works correctly", () => {
    const volumeSlider = screen.getByTestId("volume-slider");
    fireEvent.change(volumeSlider, { target: { value: "0.5" } });
    expect(store.getActions()).toContainEqual({
      type: "audioSlice/setVolume",
      payload: { audioPlayedId: "test-id", volume: "0.5" },
    });
  });

  test("trimAudioBuffer function works correctly", async () => {
    const mockCutWaveformBuffer = new AudioBuffer({
      length: 44100,
      sampleRate: 44100,
    });

    render(
      <Provider store={store}>
        <AudioPlayer
          file={null}
          cutWaveformBuffer={mockCutWaveformBuffer}
          userData={null}
          audioPlayedId="test-id"
        />
      </Provider>
    );

    const [firstTrimButton, secondTrimButton] =
      screen.getAllByTestId("trim-button");
    fireEvent.click(firstTrimButton);
    fireEvent.click(secondTrimButton);

    await waitFor(() => {
      expect(store.getActions()).toContainEqual({
        type: "audioSlice/setAudioBuffer",
        payload: {
          audioPlayedId: "test-id",
          audioBuffer: mockCutWaveformBuffer,
        },
      });
    });
  });
  // test("handleSelectionChange function works correctly", async () => {
  //   const handleSelectionChangeMock = jest.spyOn(
  //     AudioPlayer.prototype,
  //     "handleSelectionChange"
  //   );

  //   render(
  //     <Provider store={store}>
  //       <AudioPlayer
  //         file={null}
  //         cutWaveformBuffer={null}
  //         userData={null}
  //         audioPlayedId="test-id"
  //       />
  //     </Provider>
  //   );

  //   const waveformComponents = await findAllByTestId(container, "waveform");
  //   const waveformComponent = waveformComponents[0];

  //   fireEvent(
  //     waveformComponent,
  //     new CustomEvent("selectionChange", {
  //       bubbles: true,
  //       detail: { start: 0, end: 1 },
  //     })
  //   );

  //   expect(handleSelectionChangeMock).toHaveBeenCalledWith(0, 1);
  //   expect(store.getActions()).toContainEqual({
  //     type: "audioSlice/setSelectedStart",
  //     payload: { audioPlayedId: "test-id", selectedStart: 0 },
  //   });
  //   expect(store.getActions()).toContainEqual({
  //     type: "audioSlice/setSelectedEnd",
  //     payload: { audioPlayedId: "test-id", selectedEnd: 1 },
  //   });

  //   handleSelectionChangeMock.mockRestore(); // Clean up the mocked function
  // });
});
