import { useRef } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

const CircleModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const CircleModalWrapper = styled.div`
  background-color: #f8f9fa;
  color: #333;
  border: 5px solid #555;
  border-radius: 50%;
  padding: 2rem;
  position: relative;
  width: 400px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
`;

function CircleModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  const wrapperRef = useRef();

  const handleWrapperClick = e => {
    e.stopPropagation(); // Stop event propagation
  };

  return ReactDOM.createPortal(
    <CircleModalOverlay onClick={onClose}>
      <CircleModalWrapper ref={wrapperRef} onClick={handleWrapperClick}>
        {children}
      </CircleModalWrapper>
    </CircleModalOverlay>,
    document.getElementById("modal-root")
  );
}

export default CircleModal;
