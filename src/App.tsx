import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useDispatch, useSelector } from "react-redux";
import MusicEditor from "./pages/MusicEditor/MusicEditor";
import Login from "./pages/Login/Login";
import AudioRecorder from "./pages/AudioRecorder/AudioRecorder";
import Sidebar from "./components/common/Sidebar/Sidebar";
import { GuideDesktop, Title, Container } from "./styles";
import ModalManager from "./components/common/Modal/ModalManager";
import getApiWithToken from "./pages/MusicList/api";
import { setUserData } from "./feature/userDataSlice";
import { RootState } from "./store";

function App() {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1274px)" });
  const dispatch = useDispatch();

  const userData = useSelector((state: RootState) => state.userData.data);

  useEffect(() => {
    const reloadPage = async () => {
      try {
        const user = await getApiWithToken("user");
        dispatch(setUserData(user));
      } catch (error) {
        console.error("Error fetching user data:", error);
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
    <Router>
      <Container>
        {userData && (
          <>
            <Sidebar />
            <ModalManager />
            <Routes>
              <Route path="/" element={<MusicEditor />} />
              <Route path="/audiorecorder" element={<AudioRecorder />} />
            </Routes>
          </>
        )}

        {!userData && (
          <>
            <div>
              <Title>Harmony HUB</Title>
            </div>
            <div>
              <Login />
            </div>
          </>
        )}
      </Container>
    </Router>
  );
}

export default App;
