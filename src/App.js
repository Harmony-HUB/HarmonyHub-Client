import { useState } from "react";
import styled from "styled-components";
import Button from "./components/common/Button";
import MusicEditor from "./components/Editor";
import Modal from "./components/Modal";

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <Header>
        <Button onClick={openModal}>Login</Button>
      </Header>
      <Title>Harmony HUB</Title>
      <MusicEditor />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {/* Add your modal content here */}
        <h2>Login Form</h2>
        {/* Include your login form components here */}
      </Modal>
    </Container>
  );
}

export default App;
