import styled from "styled-components";

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
