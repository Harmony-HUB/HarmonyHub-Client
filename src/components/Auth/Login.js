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
        "http://localhost:3001/user",
        userObject,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          responseType: "json",
          withCredentials: true,
        }
      );

      onLogin();

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      closeModal();

      const token = localStorage.getItem("access_token");
      const protectedResponse = await axios.get(
        "http://localhost:3001/protected",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(protectedResponse);
    } catch (error) {
      console.error("Error logging in with Google", error);
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
