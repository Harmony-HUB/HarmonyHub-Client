import PropTypes from "prop-types";
import ReactDOM from "react-dom";

function Modal({ isOpen, children, onClose }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <button
      type="button"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <button
        type="button"
        style={{
          backgroundColor: "#fff",
          padding: "1rem",
          borderRadius: "5px",
          width: "400px",
          maxWidth: "80%",
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </button>
    </button>,
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
