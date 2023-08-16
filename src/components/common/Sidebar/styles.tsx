import styled from "styled-components";
import { Link as RouterLink } from "react-router-dom";
import THEME_COLORS from "../../../config/themeColors";

interface StyledSidebarProps {
  isOpen: boolean;
}

interface StyledLinkProps {
  activeColor?: string;
}

export const ToggleButton = styled.button`
  position: absolute;
  left: 10px;
  top: 30px;
  background-color: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
  outline: none;
  z-index: 10;
`;

export const NavLinks = styled.nav`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const OpenButtonSpan = styled.span`
  display: block;
  padding: 10px;
  color: black;
  text-decoration: none;
  text-align: center;
`;

export const StyledSidebar = styled.div<StyledSidebarProps>`
  height: 100%;
  width: 100px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: ${THEME_COLORS.SIDEBAR};
  transition: transform 0.3s ease-in-out;
  padding-top: 60px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.3);
  transform: translateX(${({ isOpen }) => (isOpen ? "0" : "-100px")});
`;

export const StyledLink = styled(RouterLink)<StyledLinkProps>`
  color: inherit;
  text-decoration: none;

  &:visited {
    color: inherit;
  }

  &:hover {
    color: inherit;
    text-decoration: none;
  }

  &:active {
    color: inherit;
  }
`;

export const NavLink = styled.a`
  margin-top: 20px;
  padding: 8px 16px 8px 16px;
  text-decoration: none;
  font-size: 16px;
  color: ${THEME_COLORS.SIDEBAR_NAV_LINK};
  display: block;
  transition: 0.3s;

  &:hover {
    color: ${THEME_COLORS.SIDEBAR};
    background-color: ${THEME_COLORS.SIDEBAR_HOVER};
  }
`;

export const SidebarButton = styled.button`
  all: initial;
  color: inherit;
  cursor: pointer;
  &:hover {
    color: ${THEME_COLORS.SIDEBAR};
    background-color: ${THEME_COLORS.SIDEBAR_HOVER};
  }
`;
