import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import Logout from "../Auth/Logout";
import {
  OpenButton,
  OpenButtonSpan,
  StyledSidebar,
  ToggleButton,
  ToggleButtonSpan,
  NavLinks,
  NavLink,
} from "./styles";

export const StyledLink = styled(RouterLink)`
  color: inherit;
  text-decoration: none;

  &:visited {
    color: inherit;
  }

  &:hover {
    color: inherit;
  }

  &:active {
    color: inherit;
  }
`;

function Sidebar({ onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {!isOpen && (
        <OpenButton onClick={toggleSidebar}>
          <OpenButtonSpan>&#9776;</OpenButtonSpan>
        </OpenButton>
      )}
      <StyledSidebar isOpen={isOpen}>
        <ToggleButton onClick={toggleSidebar}>
          <ToggleButtonSpan>&#9776;</ToggleButtonSpan>
        </ToggleButton>
        <Logout onLogout={onLogout} />
        <NavLinks>
          <NavLink href="">
            <StyledLink to="/">Home</StyledLink>
          </NavLink>
          <NavLink href="">
            <StyledLink to="/audiorecorder">노래 녹음</StyledLink>
          </NavLink>
          <NavLink href="#link4">Link 4</NavLink>
        </NavLinks>
      </StyledSidebar>
    </>
  );
}

export default Sidebar;
