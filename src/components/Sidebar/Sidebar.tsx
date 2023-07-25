import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import {
  OpenButton,
  ToggleButton,
  NavLinks,
  NavLink,
  StyledSidebar,
  StyledLink,
  SidebarButton,
} from "./styles";

interface SidebarProps {
  onLogout: () => void;
}

function Sidebar({ onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleGoogleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    onLogout();
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
