import { useState, useEffect } from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MusicEditor from "./components/MusicEditor/MusicEditor";
import Login from "./components/Auth/Login";
import MP3Modal from "./components/common/Modal/MP3Modal";
import Logout from "./components/Auth/Logout";
import SongsList from "./components/MusicList";
import Button from "./components/common/Button/Button";

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

    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setUserdata({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);
  console.log(userData);

  return (
    <div>
      <Router>
        <Container>
          <Header>
            <Button onClick={openSongsListModal}>My Songs List</Button>
            {isLoggedIn ? (
              <Logout onLogout={handleLogout} />
            ) : (
              <Login onLogin={handleLogin} />
            )}
          </Header>
          <Link to="/">
            <Title>Harmony HUB</Title>
          </Link>
          <Routes>
            <Route path="/" element={<MusicEditor userData={userData} />} />
          </Routes>
        </Container>
        <MP3Modal
          isOpen={isSongsListModalOpen}
          onRequestClose={closeSongsListModal}
          contentLabel="Songs List Modal"
        >
          <SongsList />
          <Button onClick={closeSongsListModal}>Close</Button>
        </MP3Modal>
      </Router>
    </div>
  );
}

export default App;
