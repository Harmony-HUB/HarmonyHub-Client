import PropTypes from "prop-types";
import ReactDOM from "react-dom";

function MP3Modal({ isOpen, children, onClose, onPlay }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      role="button"
      tabIndex={0}
      onClick={onClose}
      onKeyDown={e => {
        if (e.key === "Enter" || e.key === " ") onClose();
      }}
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
      }}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
        style={{
          backgroundColor: "#1f1f1f",
          borderRadius: "20px",
          width: "300px",
          height: "450px",
          maxWidth: "80%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          color: "#fff",
          border: "none",
          cursor: "default",
        }}
      >
        <div
          style={{
            backgroundColor: "#000",
            borderRadius: "10px",
            width: "90%",
            height: "50%",
            marginBottom: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflowY: "auto",
          }}
        >
          {children}
        </div>
        <div
          style={{
            borderRadius: "50%",
            width: "60%",
            height: "40%",
            backgroundColor: "#4d4d4d",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
          }}
        >
          <button
            type="button"
            onClick={onPlay}
            style={{
              borderRadius: "50%",
              backgroundColor: "transparent",
              border: "none",
              width: "80%",
              height: "80%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                borderRadius: "50%",
                width: "50%",
                height: "50%",
                backgroundColor: "#bfbfbf",
              }}
            />
          </button>
        </div>
      </div>
    </div>,
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
