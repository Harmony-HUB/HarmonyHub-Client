import { useState, useEffect, useRef } from "react";
import {
  MusicLists,
  MusicButton,
  MusicInfo,
  MusicTitle,
  MusicCreationTime,
} from "./styles";
import getApiWithToken from "./api";

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
    const loadMusics = async () => {
      try {
        const musicData = await getApiWithToken("musics");
        setMusics(musicData);
      } catch (error) {
        console.error(error);
      }
    };

    loadMusics();
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
