import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import styled from "styled-components";

const ModalBackground = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: #1f1f1f;
  border-radius: 20px;
  width: 300px;
  height: 450px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.3);
  color: #fff;
  border: none;
  cursor: default;
`;

const ContentArea = styled.div`
  background-color: #000;
  border-radius: 10px;
  width: 300px;
  height: 200px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow-y: auto;
  cursor: pointer;
`;

const PlayButtonWrapper = styled.div`
  border-radius: 50%;
  width: 60%;
  height: 40%;
  background-color: #4d4d4d;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const PlayButton = styled.button`
  border-radius: 50%;
  background-color: transparent;
  border: none;
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const PlayButtonInner = styled.div`
  border-radius: 50%;
  width: 50%;
  height: 50%;
  background-color: #bfbfbf;
`;

function MP3Modal({ isOpen, children, onClose, onPlay }) {
  if (!isOpen) return null;

  const handleBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return ReactDOM.createPortal(
    <ModalBackground
      role="button"
      tabIndex={0}
      onClick={handleBackgroundClick}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
    >
      <ModalContent
        role="button"
        tabIndex={0}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
      >
        <ContentArea>{children}</ContentArea>
        <PlayButtonWrapper>
          <PlayButton onClick={onPlay}>
            <PlayButtonInner />
          </PlayButton>
        </PlayButtonWrapper>
      </ModalContent>
    </ModalBackground>,
    document.getElementById("modal-root")
  );
}

MP3Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  onPlay: PropTypes.func.isRequired,
};

MP3Modal.defaultProps = {
  children: null,
};

export default MP3Modal;
