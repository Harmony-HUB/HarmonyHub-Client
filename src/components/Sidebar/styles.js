import styled from "styled-components";

export const StyledSidebar = styled.div`
  position: fixed;
  top: 0;
  left: ${props => (props.isOpen ? "0" : "-200px")};
  width: 4%;
  height: 100%;
  background-color: #333;
  padding-top: 20px;
  transition: left 0.3s;
`;

export const ToggleButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 0;
  margin: 0;
`;

export const ToggleButtonSpan = styled.span`
  display: block;
  padding: 10px;
  color: black;
  text-decoration: none;
  text-align: center;
`;

export const NavLinks = styled.nav`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

export const NavLink = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin: 5px;
  background-color: #333;
  color: white;
  text-decoration: none;
  border-radius: 4px;

  &:hover {
    background-color: #555;
  }
`;

export const OpenButton = styled.button`
  position: fixed;
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
