import React, { useState } from "react";
import { Link } from "react-router-dom";
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
        <Logout onLogout={onLogout} />
        <ToggleButton onClick={toggleSidebar}>
          <ToggleButtonSpan>&#9776;</ToggleButtonSpan>
        </ToggleButton>
        <NavLinks>
          <NavLink href="">
            <Link to="/audiorecorder">노래 녹음</Link>
          </NavLink>
          <NavLink href="">
            <Link to="/">Home</Link>
          </NavLink>
          <NavLink href="#link3">
            <Link to="audioplayer">Audio Editor</Link>
          </NavLink>
          <NavLink href="#link4">Link 4</NavLink>
        </NavLinks>
      </StyledSidebar>
    </>
  );
}

export default Sidebar;
