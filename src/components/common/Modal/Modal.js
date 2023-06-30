import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "styled-components";

const Overlay = styled.button`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
`;

const Content = styled.button`
  background-color: #fff;
  padding: 1rem;
  border-radius: 5px;
  width: 400px;
  max-width: 80%;
`;

function Modal({ isOpen, children, onClose }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <Overlay onClick={onClose}>
      <Content onClick={e => e.stopPropagation()}>{children}</Content>
    </Overlay>,
    document.getElementById("modal-root")
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

Modal.defaultProps = {
  children: null,
};

export default Modal;
