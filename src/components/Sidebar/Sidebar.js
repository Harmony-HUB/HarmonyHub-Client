import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Logout from "../Auth/Logout";
import { OpenButton, ToggleButton, NavLinks } from "./styles";

export const StyledLink = styled(RouterLink)`
  color: inherit;
  text-decoration: none;

  &:visited {
    color: inherit;
  }

  &:hover {
    color: #4b4b4b;
    text-decoration: underline;
  }

  &:active {
    color: inherit;
  }
`;

const StyledSidebar = styled.div`
  height: 100%;
  width: 100px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #f1f1f1;
  transition: transform 0.3s ease-in-out;
  padding-top: 60px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100px")});
`;

const NavLink = styled.a`
  padding: 8px 16px 8px 16px;
  text-decoration: none;
  font-size: 18px;
  color: #818181;
  display: block;
  transition: 0.3s;

  &:hover {
    color: #f1f1f1;
    background-color: #4b4b4b;
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
          <Logout onLogout={onLogout} />
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
