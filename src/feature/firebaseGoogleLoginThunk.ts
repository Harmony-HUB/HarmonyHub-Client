import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import axios, { AxiosResponse } from "axios";
import app from "../config/firebase-config";
import CONFIG from "../config/config";

const firebaseGoogleLoginThunk = createAsyncThunk(
  "user/login",
  async (_, { rejectWithValue }) => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      const userObject = {
        email: user.email,
        name: user.displayName,
      };

      const response: AxiosResponse = await axios.post(
        `${CONFIG.REACT_APP_API_URL}/user`,
        userObject,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { accessToken, refreshToken } = response.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export default firebaseGoogleLoginThunk;
