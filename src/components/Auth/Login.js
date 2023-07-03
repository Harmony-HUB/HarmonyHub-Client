import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios from "axios";
import PropTypes from "prop-types";
import app from "../../config/firebase-config";
import Button from "../common/Button/Button";
import Modal from "../common/Modal/Modal";

function Login({ onLogin }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleGoogleLogin = async () => {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      const userObject = {
        email: user.email,
        name: user.displayName,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/user`,
        userObject,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          responseType: "json",
          withCredentials: true,
        }
      );
      if (response.status !== 200) {
        throw new Error("서버가 원활하지 않습니다. 잠시후 다시 시도해 주세요.");
      } else {
        onLogin();
      }

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      closeModal();

      const token = localStorage.getItem("access_token");

      await axios.get(`${process.env.REACT_APP_API_URL}/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Error logging in with Google", error);
      }
    }
  };

  return (
    <>
      <Button onClick={openModal}>Login</Button>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <Button onClick={handleGoogleLogin}>Google Login</Button>
      </Modal>
    </>
  );
}

Login.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default Login;
