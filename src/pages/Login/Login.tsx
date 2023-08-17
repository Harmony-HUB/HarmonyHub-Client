import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import firebaseGoogleLoginThunk from "../../feature/firebaseGoogleLoginThunk";
import { AppDispatch } from "../../store";
import { Title } from "../../styles";

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await dispatch(firebaseGoogleLoginThunk());
    navigate("/");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Title>Harmony HUB</Title>
      <Button onClick={openModal}>Login</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Button onClick={handleLogin}>Google Login</Button>
      </Modal>
    </>
  );
}

export default Login;
