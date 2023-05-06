/* eslint-disable no-undef */
import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import fetch from "cross-fetch";
import MusicEditor from "../../src/components/MusicEditor/MusicEditor";
import server from "../__mocks__/mock";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const mockStore = configureMockStore();
const store = mockStore({ audioPlayer: { instances: {} } });

global.URL.createObjectURL = jest.fn(() => "mocked_blob_url");
global.fetch = fetch;

describe("MusicEditor", () => {
  test("renders the component", () => {
    render(
      <Provider store={store}>
        <MusicEditor userData={null} />
      </Provider>
    );

    expect(screen.getByText("파일 선택")).toBeInTheDocument();
  });

  test("adds an audio player when a file is selected", () => {
    render(
      <Provider store={store}>
        <MusicEditor userData={null} />
      </Provider>
    );

    const fileInput = screen.getByLabelText("파일 선택");

    fireEvent.change(fileInput, {
      target: {
        files: [new File([""], "audio-file.mp3", { type: "audio/mpeg" })],
      },
      absoluteURL: "https://localhost:3000/audio-file.mp3",
    });

    expect(screen.getByText("오디오 결합")).toBeInTheDocument();
  });
});
