import axios, { AxiosError } from "axios";
import CONFIG from "../../config/config";
import refreshAccessToken from "../../components/Auth/refreshAccessToken";

const fetchMusics = async () => {
  let newToken;
  try {
    const token = localStorage.getItem("access_token");
    const response = await axios.get(`${CONFIG.REACT_APP_API_URL}/musics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    if (axiosError.response && axiosError.response.status === 403) {
      newToken = await refreshAccessToken();
      if (!newToken) {
        throw new Error("유효하지 않은 토큰입니다. 다시 로그인 해주세요.");
      }
    }
    const response = await axios.get(`${CONFIG.REACT_APP_API_URL}/musics`, {
      headers: {
        Authorization: `Bearer ${newToken}`,
      },
    });
    return response.data;
  }
};

export default fetchMusics;
