import { useState, useEffect } from "react";
import styled from "styled-components";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MusicEditor from "./components/MusicEditor/MusicEditor";
import Login from "./components/Auth/Login";
import MP3Modal from "./components/common/Modal/MP3Modal";
import Logout from "./components/Auth/Logout";
import SongsList from "./components/MusicList";
import Button from "./components/common/Button/Button";
import AudioRecorder from "./components/AudioRecorder";

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 88%;
  height: 15%;
  padding: 1rem 2rem;
  position: absolute;
  top: 0;
  left: 0;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #3bd6c6;
  margin-bottom: 1rem;
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserdata] = useState({});
  const [isSongsListModalOpen, setIsSongsListModalOpen] = useState(false);
  const [IsCircleModalOpen, setIsCircleModalOpen] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const openSongsListModal = () => {
    setIsSongsListModalOpen(true);
  };

  const closeSongsListModal = () => {
    setIsSongsListModalOpen(false);
  };

  const openCircleModal = () => {
    setIsCircleModalOpen(true);
  };

  const closeCircleModal = () => {
    setIsCircleModalOpen(false);
  };

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserdata({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <Container>
        <Header>
          <Button onClick={openSongsListModal}>My Songs List</Button>
          {isLoggedIn ? (
            <Logout onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )}
          <Button onClick={openCircleModal}>Open Circle Modal</Button>
        </Header>
        <Title>Harmony HUB</Title>
        <MusicEditor userData={userData} />
      </Container>
      <MP3Modal
        isOpen={isSongsListModalOpen}
        onRequestClose={closeSongsListModal}
        contentLabel="Songs List Modal"
      >
        <SongsList
          isOpen={isSongsListModalOpen}
          closeModal={closeSongsListModal}
        />
      </MP3Modal>
      <AudioRecorder
        isOpen={IsCircleModalOpen}
        onClose={closeCircleModal}
        userData={userData}
      />
    </div>
  );
}

export default App;
