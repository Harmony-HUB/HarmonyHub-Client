import { useState } from "react";
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { getAuth, signOut } from "firebase/auth";
import {
  OpenButton,
  ToggleButton,
  NavLinks,
  NavLink,
  StyledSidebar,
  StyledLink,
  SidebarButton,
} from "./styles";
import { setUserLogout } from "../../../feature/userDataSlice";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleGoogleLogout = () => {
    const auth = getAuth();

    signOut(auth).then(() => {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    });

    dispatch(setUserLogout(null));
  };

  return (
    <>
      {!isOpen && (
        <OpenButton onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </OpenButton>
      )}
      <StyledSidebar isOpen={isOpen}>
        {isOpen && (
          <ToggleButton onClick={toggleSidebar}>
            <FontAwesomeIcon icon={faBars} />
          </ToggleButton>
        )}
        <NavLinks>
          <NavLink>
            <SidebarButton onClick={handleGoogleLogout}>로그아웃</SidebarButton>
          </NavLink>
          <NavLink>
            <StyledLink to="/">Home</StyledLink>
          </NavLink>
          <NavLink>
            <StyledLink to="/audiorecorder">노래 녹음</StyledLink>
          </NavLink>
        </NavLinks>
      </StyledSidebar>
    </>
  );
}

export default Sidebar;
