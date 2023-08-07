import { useState } from "react";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import firebaseGoogleLogin from "./api";

interface LoginProps {
  onLogin: () => void;
}

function Login({ onLogin }: LoginProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const response = await firebaseGoogleLogin();
      if (response.status !== 200) {
        throw Error("서버가 원활하지 않습니다. 잠시후 다시 시도해주세요.");
      } else {
        onLogin();
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error logging in with Google", error);
      }
    }
  };
  return (
    <div>
      <Button onClick={openModal}>Login</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Button onClick={handleGoogleLogin}>Google Login</Button>
      </Modal>
    </div>
  );
}

export default Login;
