/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import refreshAccessToken from "./Auth/refreshAccessToken";

const SongsListContent = styled.div`
  border-radius: 20px;
  width: 100%;
  height: 100%;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  color: #fff;
  border: none;
  cursor: default;
`;

const SongButton = styled.button`
  background-color: ${({ isSelected }) =>
    isSelected ? "rgba(355, 355, 355, 0.1)" : ""};
  border: none;
  width: 100%;
  text-align: left;
`;

function SongsList() {
  const [songs, setSongs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchSongs() {
      let newToken;
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/songs`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSongs(response.data);
      } catch (error) {
        if (error.response && error.response.status === 403) {
          newToken = await refreshAccessToken();

          if (!newToken) {
            console.error("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
            return;
          }
        }

        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/songs`,
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );

          setSongs(response.data);
        } catch (retryError) {
          console.error(
            "액세스 토큰을 새로 고친 후 음악 리스트를 불러오는 동안 오류가 발생했습니다.",
            retryError
          );
        }
      }
    }

    fetchSongs();
  }, []);

  const handleSongSelection = (index, song) => {
    setSelectedIndex(index);
    if (audioRef.current) {
      if (audioRef.current.src !== song.url) {
        audioRef.current.src = song.url;
      }
      if (playing && selectedIndex === index) {
        audioRef.current.pause();
        setPlaying(false);
      } else {
        audioRef.current.play();
        setPlaying(true);
      }
    }
  };

  return (
    <div>
      <SongsListContent onClick={e => e.stopPropagation()}>
        <ul>
          {Array.isArray(songs) &&
            songs.map((song, index) => (
              <SongButton
                type="button"
                key={song.key}
                tabIndex={index}
                onClick={() => handleSongSelection(index, song)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleSongSelection(index, song);
                  }
                }}
                isSelected={selectedIndex === index}
              >
                <div>
                  <h3>{song.title}</h3>
                  <p>{new Date(song.creationTime).toLocaleString()}</p>
                </div>
              </SongButton>
            ))}
        </ul>
      </SongsListContent>
      <audio ref={audioRef} />
    </div>
  );
}

export default SongsList;
