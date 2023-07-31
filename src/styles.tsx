import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: #3bd6c6;
  margin-bottom: 1rem;
`;

export const MyMusicButton = styled.div`
  position: absolute;
  bottom: 0;
  top: 80px;
  right: 5%;
`;

export const GuideDesktop = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
