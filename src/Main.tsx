import { Route, Routes, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useDispatch } from "react-redux";
import MusicEditor from "./pages/MusicEditor/MusicEditor";
import Login from "./pages/Login/Login";
import AudioRecorder from "./pages/AudioRecorder/AudioRecorder";
import { GuideDesktop, Title, Container } from "./styles";
import getApiWithToken from "./pages/MusicList/api";
import { setUserData } from "./feature/userDataSlice";

function MainApp() {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1274px)" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const reloadPage = async () => {
      try {
        const user = await getApiWithToken("user");
        dispatch(setUserData(user));
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    reloadPage();
  }, []);

  if (!isDesktopOrLaptop) {
    return (
      <GuideDesktop>
        <Title>Harmony HUB</Title>
        <h1>이 사이트는 데스크탑에서 이용할 수 있습니다.</h1>
      </GuideDesktop>
    );
  }

  return (
    <Container>
      <Routes>
        <Route path="/" element={<MusicEditor />} />
        <Route path="/login" element={<Login />} />
        <Route path="/audiorecorder" element={<AudioRecorder />} />
      </Routes>
    </Container>
  );
}

export default MainApp;
