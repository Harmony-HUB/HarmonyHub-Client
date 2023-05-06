import axios from "axios";

async function refreshAccessToken() {
  try {
    const refreshToken = localStorage.getItem("refresh_token");

    if (!refreshToken) {
      console.error("Refresh token not found. Please log in again.");
      return null;
    }

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/auth/refresh`,
      {
        refreshToken,
      }
    );

    const newAccessToken = response.data.access_token;
    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}

export default refreshAccessToken;
