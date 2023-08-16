import { useState } from "react";
import { useDispatch } from "react-redux";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import firebaseGoogleLoginThunk from "../../feature/firebaseGoogleLoginThunk";
import { AppDispatch } from "../../store";

function Login() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = () => {
    dispatch(firebaseGoogleLoginThunk());
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button onClick={openModal}>Login</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Button onClick={handleLogin}>Google Login</Button>
      </Modal>
    </>
  );
}

export default Login;
