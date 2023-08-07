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
  top: 10px;
  margin-left: 5px;
  background-color: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
  outline: none;
  z-index: 1;
`;

export const NavLinks = styled.nav`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const OpenButton = styled.button`
  position: fixed;
  font-size: 30px;
  top: 10px;
  left: 10px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  margin: 0;
  z-index: 1000;
`;

export const OpenButtonSpan = styled.span`
  display: block;
  padding: 10px;
  color: black;
  text-decoration: none;
  text-align: center;
`;

export const StyledLink = styled(RouterLink)<StyledLinkProps>`
  color: inherit;
  text-decoration: none;

  &:visited {
    color: inherit;
  }

  &:hover {
    color: ${THEME_COLORS.SIDEBAR_HOVER};
    text-decoration: underline;
  }

  &:active {
    color: inherit;
  }
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

export const NavLink = styled.a`
  margin-top: 20px;
  padding: 8px 16px 8px 16px;
  text-decoration: none;
  font-size: 18px;
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
  color: ${THEME_COLORS.SIDEBAR_NAV_LINK};
  &:hover {
    color: ${THEME_COLORS.SIDEBAR};
    background-color: ${THEME_COLORS.SIDEBAR_HOVER};
  }
`;
