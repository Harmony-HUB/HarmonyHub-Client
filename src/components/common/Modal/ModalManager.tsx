import { useState } from "react";
import MP3Modal from "./MP3Modal/MP3Modal";
import MusicList from "../../../pages/MusicList/MusicList";
import Button from "../Button/Button";
import { MyMusicButton } from "../../../styles";

function ModalManager() {
  const [isSongsListModalOpen, setIsSongsListModalOpen] = useState(false);

  const openSongsListModal = () => {
    setIsSongsListModalOpen(true);
  };

  const closeSongsListModal = () => {
    setIsSongsListModalOpen(false);
  };

  return (
    <>
      <MyMusicButton>
        <Button onClick={openSongsListModal}>내 음악</Button>
      </MyMusicButton>
      <MP3Modal isOpen={isSongsListModalOpen} onClose={closeSongsListModal}>
        <MusicList />
      </MP3Modal>
    </>
  );
}

export default ModalManager;
