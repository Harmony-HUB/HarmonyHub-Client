import { useState, useEffect } from "react";
import styled from "styled-components";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MusicEditor from "./components/MusicEditor/MusicEditor";
import Login from "./components/Auth/Login";
import MP3Modal from "./components/common/Modal/MP3Modal";
import SongsList from "./components/MusicList";
import Button from "./components/common/Button/Button";
import AudioRecorder from "./components/Recorder/AudioRecorder";
import Sidebar from "./components/Sidebar/Sidebar";

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 88%;
  height: 5%;
  padding: 1rem 2rem;
  top: 0;
  left: 0;
  position: relative;
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

const MyMusicButton = styled.div`
  position: absolute;
  top: 10%;
  right: 5%;
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserdata] = useState({});
  const [isSongsListModalOpen, setIsSongsListModalOpen] = useState(false);

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

  useEffect(() => {
    const auth = getAuth();

    const unSubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserdata({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const renderContent = () => {
    if (isLoggedIn) {
      return (
        <>
          <Header>
            <Sidebar onLogout={handleLogout} />
            <MyMusicButton>
              <Button onClick={openSongsListModal}>내 음악</Button>
            </MyMusicButton>
          </Header>
          <Routes>
            <Route path="/" element={<MusicEditor userData={userData} />} />
            <Route
              path="/audiorecorder"
              element={<AudioRecorder userData={userData} />}
            />
          </Routes>
        </>
      );
    }
    return (
      <>
        <div>
          <Title>Harmony HUB</Title>
        </div>
        <div>
          <Login onLogin={handleLogin} />
        </div>
      </>
    );
  };

  return (
    <Router>
      <div>
        <Container>{renderContent()}</Container>
        <MP3Modal
          isOpen={isSongsListModalOpen}
          onClose={closeSongsListModal}
          contentLabel="Songs List Modal"
        >
          <SongsList closeModal={closeSongsListModal} />
        </MP3Modal>
      </div>
    </Router>
  );
}

export default App;
