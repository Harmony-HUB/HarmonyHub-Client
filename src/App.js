import { useState, useEffect } from "react";
import styled from "styled-components";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import MusicEditor from "./pages/MusicEditor/MusicEditor.tsx";
import Login from "./components/Auth/Login.tsx";
import MP3Modal from "./components/common/Modal/MP3Modal/MP3Modal.tsx";
import MusicList from "./pages/MusicList/MusicList.tsx";
import Button from "./components/common/Button/Button.tsx";
import AudioRecorder from "./pages/AudioRecorder/AudioRecorder.tsx";
import Sidebar from "./components/common/Sidebar/Sidebar.tsx";

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
  bottom: 0;
  top: 80px;
  right: 5%;
`;

const GuideDesktop = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserdata] = useState({});
  const [isSongsListModalOpen, setIsSongsListModalOpen] = useState(false);

  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1274px)",
  });

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
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => {
      unSubscribe();
    };
  }, []);

  const renderContent = () => {
    if (!isDesktopOrLaptop) {
      return (
        <GuideDesktop>
          <Title>Harmony HUB</Title>
          <h1>이 사이트는 데스크탑에서 이용할 수 있습니다.</h1>
        </GuideDesktop>
      );
    }

    if (isLoggedIn) {
      return (
        <>
          <Sidebar onLogout={handleLogout} />
          <MyMusicButton>
            <Button onClick={openSongsListModal}>내 음악</Button>
          </MyMusicButton>

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
          <MusicList closeModal={closeSongsListModal} />
        </MP3Modal>
      </div>
    </Router>
  );
}

export default App;
