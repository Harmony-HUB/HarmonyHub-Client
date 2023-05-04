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
  test("renders the component", () => {
    render(
      <Provider store={store}>
        <AudioPlayer
          file={null}
          cutWaveformBuffer={null}
          userData={null}
          audioPlayedId="test-id"
        />
      </Provider>
    );
    expect(screen.getByTestId("audio-player-container")).toBeInTheDocument();
  });
});
