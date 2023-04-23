/* eslint-disable jsx-a11y/media-has-caption */
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const styles = {
  modalBackground: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1f1f1f",
    borderRadius: "20px",
    width: "300px",
    height: "450px",
    maxWidth: "80%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    color: "#fff",
    border: "none",
    cursor: "default",
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  songButton: isSelected => ({
    backgroundColor: isSelected ? "rgba(255, 255, 255, 0.1)" : "",
    border: "none",
    width: "100%",
    textAlign: "left",
  }),
};

function SongsList() {
  const [songs, setSongs] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    async function fetchSongs() {
      try {
        const response = await axios.get("http://localhost:3001/songs");
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

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button type="button" onClick={openModal}>
        Open MP3 Player
      </button>
      {modalIsOpen && (
        <div style={styles.modalBackground}>
          <div style={styles.modalContent}>
            <button
              type="button"
              onClick={closeModal}
              style={styles.closeButton}
            >
              Close
            </button>
            <ul>
              {songs.map((song, index) => (
                <button
                  type="button"
                  key={song.key}
                  tabIndex={index}
                  onClick={() => setSelectedIndex(index)}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      setSelectedIndex(index);
                    }
                  }}
                  style={styles.songButton(selectedIndex === index)}
                >
                  <div>
                    <h3>{song.title}</h3>
                    <p>{new Date(song.creationTime).toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </ul>
            <button type="button" onClick={onModalPlayClick}>
              {playing ? "Pause" : "Play"}
            </button>
          </div>
        </div>
      )}
      <audio ref={audioRef} />
    </div>
  );
}

export default SongsList;
