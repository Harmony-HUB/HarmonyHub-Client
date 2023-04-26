/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import styled from "styled-components";

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #1f1f1f;
  border-radius: 20px;
  width: 300px;
  height: 450px;
  max-width: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  color: #fff;
  border: none;
  cursor: default;
`;

const SongButton = styled.button`
  background-color: ${({ isSelected }) =>
    isSelected ? "rgba(255, 255, 255, 0.1)" : ""};
  border: none;
  width: 100%;
  text-align: left;
`;

const SongListContainer = styled.div`
  align-items: center;
  height: 300px;
  overflow-y: auto;
  border-radius: 20px;
`;

function SongsList({ isOpen }) {
  const [songs, setSongs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get("http://localhost:3001/songs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      }
    }

    fetchSongs();
  }, []);

  const onModalPlayClick = () => {
    const selectedSong = songs[selectedIndex];
    if (audioRef.current && selectedSong) {
      if (audioRef.current.paused) {
        if (audioRef.current.src !== selectedSong.url) {
          audioRef.current.src = selectedSong.url;
        }
        audioRef.current.play();
        setPlaying(true);
      } else {
        audioRef.current.pause();
        setPlaying(false);
      }
    }
  };

  return (
    <div>
      {isOpen && (
        <ModalBackground>
          <ModalContent>
            <SongListContainer>
              <ul>
                {Array.isArray(songs) &&
                  songs.map((song, index) => (
                    <SongButton
                      type="button"
                      key={song.key}
                      tabIndex={index}
                      onClick={() => setSelectedIndex(index)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedIndex(index);
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
            </SongListContainer>
            <button type="button" onClick={onModalPlayClick}>
              {playing ? "Pause" : "Play"}
            </button>
          </ModalContent>
        </ModalBackground>
      )}
      <audio ref={audioRef} />
    </div>
  );
}

export default SongsList;
