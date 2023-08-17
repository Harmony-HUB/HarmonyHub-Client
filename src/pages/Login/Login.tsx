import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import firebaseGoogleLoginThunk from "../../feature/firebaseGoogleLoginThunk";
import { AppDispatch } from "../../store";
import { Title } from "../../styles";
import { Cat, LoginContainer, Notes, NotesLottie, LoginButton } from "./styles";
import notesAnimation from "../../lottie/notesAnimation.json";

function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogin = async () => {
    await dispatch(firebaseGoogleLoginThunk());
    navigate("/");
  };

  return (
    <LoginContainer>
      <NotesLottie animationData={notesAnimation} />
      <Notes />
      <Title>Harmony HUB</Title>
      <LoginButton onClick={handleLogin}>Login</LoginButton>
      <Cat />
    </LoginContainer>
  );
}

export default Login;
