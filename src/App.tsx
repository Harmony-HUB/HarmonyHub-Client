import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import MusicEditor from "./pages/MusicEditor/MusicEditor";
import Login from "./components/Auth/Login";
import MP3Modal from "./components/common/Modal/MP3Modal/MP3Modal";
import MusicList from "./pages/MusicList/MusicList";
import Button from "./components/common/Button/Button";
import AudioRecorder from "./pages/AudioRecorder/AudioRecorder";
import Sidebar from "./components/common/Sidebar/Sidebar";
import { GuideDesktop, Title, MyMusicButton, Container } from "./styles";
import { UserData } from "./types";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserdata] = useState<UserData | null>(null);
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
      if (user && user.email && user.displayName) {
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
            {userData && (
              <Route path="/" element={<MusicEditor userData={userData} />} />
            )}
            {userData && (
              <Route
                path="/audiorecorder"
                element={<AudioRecorder userData={userData} />}
              />
            )}
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
        <MP3Modal isOpen={isSongsListModalOpen} onClose={closeSongsListModal}>
          <MusicList />
        </MP3Modal>
      </div>
    </Router>
  );
}

export default App;
