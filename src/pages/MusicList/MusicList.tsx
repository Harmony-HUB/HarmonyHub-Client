import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import refreshAccessToken from "../../components/Auth/refreshAccessToken";
import {
  MusicLists,
  MusicButton,
  MusicInfo,
  MusicTitle,
  MusicCreationTime,
} from "./styles";
import CONFIG from "../../config/config";

interface Musics {
  url: string;
  key: string;
  title: string;
  creationTime: string;
}

function MusicList() {
  const [musics, setMusics] = useState<Musics[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    async function fetchMusics() {
      let newToken;

      try {
        const token = localStorage.getItem("access_token");
        const response = await axios.get(`${CONFIG.REACT_APP_API_URL}/musics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMusics(response.data);
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
            `${CONFIG.REACT_APP_API_URL}/musics`,
            {
              headers: {
                Authorization: `Bearer ${newToken}`,
              },
            }
          );

          setMusics(response.data);
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

    fetchMusics();
  }, []);

  const handleMusicSelection = (index: number, music: Musics) => {
    setSelectedIndex(index);

    if (audioRef.current) {
      if (audioRef.current.src !== music.url) {
        audioRef.current.src = music.url;
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
      <MusicLists onClick={e => e.stopPropagation()}>
        {Array.isArray(musics) &&
          musics.map((music, index) => (
            <MusicButton
              type="button"
              key={music.key}
              tabIndex={index}
              onClick={() => handleMusicSelection(index, music)}
              onKeyDown={e => {
                if (e.key === "Enter" || e.key === " ") {
                  handleMusicSelection(index, music);
                }
              }}
              isSelected={selectedIndex === index}
            >
              <MusicInfo>
                <MusicTitle>{music.title}</MusicTitle>
                <MusicCreationTime>
                  {new Date(music.creationTime).toLocaleString()}
                </MusicCreationTime>
              </MusicInfo>
              {selectedIndex === index && playing && <span>🎵</span>}
            </MusicButton>
          ))}
      </MusicLists>
      <audio ref={audioRef}>
        <track kind="captions" />
      </audio>
    </>
  );
}

export default MusicList;
