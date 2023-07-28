import PropTypes from "prop-types";
import ReactDOM from "react-dom";
import { ReactNode } from "react";
import {
  ModalBackground,
  ModalContent,
  ContentArea,
  PlayButtonWrapper,
  PlayButtonInner,
  PlayButton,
} from "./styles";

interface MP3ModalProps {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  onPlay: () => void;
}

function MP3Modal({ isOpen, children, onClose, onPlay }: MP3ModalProps) {
  if (!isOpen) return null;

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

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
    modalRoot
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
