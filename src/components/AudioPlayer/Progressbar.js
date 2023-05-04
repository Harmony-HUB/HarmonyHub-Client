import { useEffect, useRef } from "react";

function ProgressBar({ duration, progressPosition }) {
  const currentTime = (duration * progressPosition) / 100;

  const progressCanvasRef = useRef(null);

  const drawProgress = () => {
    const canvas = progressCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;
    const x = (progressPosition * width) / 100;

    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  useEffect(() => {
    drawProgress();
  }, [progressPosition]);

  return (
    <div
      className="progress-bar-container"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <canvas ref={progressCanvasRef} width="1350" height="100" />
      <div
        className="progress-time"
        style={{
          position: "absolute",
          bottom: 0,
          left: `${progressPosition}%`,
          transform: "translateX(-50%)",
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          padding: "2px 4px",
          borderRadius: "2px",
          fontSize: "12px",
          whiteSpace: "nowrap",
        }}
      >
        {currentTime.toFixed(2)} s
      </div>
    </div>
  );
}

export default ProgressBar;
