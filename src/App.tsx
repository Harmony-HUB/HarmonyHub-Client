import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import { useSelector } from "react-redux";
import MusicEditor from "./pages/MusicEditor/MusicEditor";
import Login from "./pages/Login/Login";
import AudioRecorder from "./pages/AudioRecorder/AudioRecorder";
import Sidebar from "./components/common/Sidebar/Sidebar";
import { GuideDesktop, Title, Container } from "./styles";
import ModalManager from "./components/common/Modal/ModalManager";
import selectUserData from "./feature/selectors";

function App() {
  const isDesktopOrLaptop = useMediaQuery({ query: "(min-width: 1274px)" });

  const userData = useSelector(selectUserData);

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
        {userData?.name && (
          <>
            <Sidebar />
            <ModalManager />
            <Routes>
              <Route path="/" element={<MusicEditor />} />
              <Route path="/audiorecorder" element={<AudioRecorder />} />
            </Routes>
          </>
        )}

        {!userData?.name && (
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
