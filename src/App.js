import { useState } from "react";
import styled from "styled-components";
import MusicEditor from "./components/Editor";
import Login from "./components/Login";
import Logout from "./components/Logout";

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

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };
  return (
    <Container>
      <Header>
        {isLoggedIn ? (
          <Logout onLogout={handleLogout} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
      </Header>
      <Title>Harmony HUB</Title>
      <MusicEditor />
    </Container>
  );
}

export default App;
