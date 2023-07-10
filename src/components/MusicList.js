/* eslint-disable consistent-return */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";
import refreshAccessToken from "./Auth/refreshAccessToken";

const SongList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  width: 200px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const SongButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em;
  border: 1 solid black;
  width: 100%;
  text-align: left;
  cursor: pointer;
  background-color: ${({ isSelected }) =>
    isSelected ? "rgba(355, 355, 355, 0.3)" : ""};
`;

const SongTitle = styled.h3`
  margin: 0;
  font-size: 1em;
`;

const SongCreationTime = styled.p`
  margin: 0;
  font-size: 0.8em;
  color: #aaa;
`;

const SongInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

function MusicList() {
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
            if (process.env.NODE_ENV !== "production") {
              console.error("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
            }
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
          if (process.env.NODE_ENV !== "production") {
            console.error(
              "액세스 토큰을 새로 고친 후 음악 리스트를 불러오는 동안 오류가 발생했습니다.",
              retryError
            );
          }
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
      <SongList onClick={e => e.stopPropagation()}>
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
              <SongInfo>
                <SongTitle>{song.title}</SongTitle>
                <SongCreationTime>
                  {new Date(song.creationTime).toLocaleString()}
                </SongCreationTime>
              </SongInfo>
              {selectedIndex === index && playing && <span>🎵</span>}
            </SongButton>
          ))}
      </SongList>
      {/* </SongsListContent> */}
      <audio ref={audioRef} />
    </div>
  );
}

export default MusicList;
