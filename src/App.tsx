import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import MusicEditor from "./pages/MusicEditor/MusicEditor";
import Login from "./components/Auth/Login";
import AudioRecorder from "./pages/AudioRecorder/AudioRecorder";
import Sidebar from "./components/common/Sidebar/Sidebar";
import { GuideDesktop, Title, Container } from "./styles";
import { UserData } from "./types";
import FirebaseAuth from "./components/Auth/FirebaseAuth";
import ModalManager from "./components/common/Modal/ModalManager";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserdata] = useState<UserData | null>(null);
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1274px)" });

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isDesktopOrLaptop) {
    return (
      <GuideDesktop>
        <Title>Harmony HUB</Title>
        <h1>이 사이트는 데스크탑에서 이용할 수 있습니다.</h1>
      </GuideDesktop>
    );
  }

  return (
    <Router>
      <Container>
        <FirebaseAuth setLoggedIn={setIsLoggedIn} setUserData={setUserdata} />

        {isLoggedIn && (
          <>
            <Sidebar onLogout={handleLogout} />
            <ModalManager />
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
        )}

        {!isLoggedIn && (
          <>
            <div>
              <Title>Harmony HUB</Title>
            </div>
            <div>
              <Login onLogin={() => setIsLoggedIn(true)} />
            </div>
          </>
        )}
      </Container>
    </Router>
  );
}

export default App;
