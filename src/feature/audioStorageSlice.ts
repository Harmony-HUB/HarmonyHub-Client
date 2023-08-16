import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import refreshAccessToken from "../components/Auth/refreshAccessToken";
import CONFIG from "../config/config";

interface UploadAudioPayload {
  audioBlob: Blob;
  title: string;
  description: string;
  // userData: { email: string };
}

export const uploadAudio = createAsyncThunk(
  "audio/upload",
  async (payload: UploadAudioPayload) => {
    const { audioBlob, title, description } = payload; // userData

    const formData = new FormData();
    formData.append("audio", audioBlob, `${title}.wav`);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("created_at", new Date().toISOString());
    // formData.append("userEmail", userData.email);

    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${CONFIG.REACT_APP_API_URL}/uploadAudio`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response && axiosError.response.status === 403) {
        const newToken = await refreshAccessToken();

        if (!newToken) {
          throw new Error("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
        }

        const response = await axios.post(
          `${CONFIG.REACT_APP_API_URL}/uploadAudio`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${newToken}`,
            },
          }
        );

        if (response.status === 200) {
          return response;
        }
      }
      throw error;
    }
  }
);

const audioStorageSlice = createSlice({
  name: "audio",
  initialState: {
    uploading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(uploadAudio.pending, state => {
      state.uploading = true;
    });
    builder.addCase(uploadAudio.fulfilled, state => {
      state.uploading = false;
    });
    builder.addCase(uploadAudio.rejected, (state, action) => {
      state.uploading = false;
      state.error = action.error.message || null;
    });
  },
});

export default audioStorageSlice.reducer;
