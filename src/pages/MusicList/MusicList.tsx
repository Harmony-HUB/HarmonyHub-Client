import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import refreshAccessToken from "../../components/Auth/refreshAccessToken";
import {
  SongList,
  SongButton,
  SongInfo,
  SongTitle,
  SongCreationTime,
} from "./styles";

interface Song {
  url: string;
  key: string;
  title: string;
  creationTime: string;
}

function MusicList() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 403) {
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

  const handleSongSelection = (index: number, song: Song) => {
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
    <>
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
      <audio ref={audioRef}>
        <track kind="captions" />
      </audio>
    </>
  );
}

export default MusicList;
