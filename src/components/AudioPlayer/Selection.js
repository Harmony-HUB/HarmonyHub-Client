import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import {
  setSelectedStart,
  setSelectedEnd,
} from "../../feature/audioPlayerSlice";

const SelectionHandle = styled.div`
  position: absolute;
  top: -10px;
  width: 10px;
  height: 120px;
  cursor: col-resize;
  z-index: 1px;
  background-color: #6bb9f0;
  border: 1px solid white;
  box-sizing: border-box;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const SelectionHandleLeft = styled(SelectionHandle)`
  left: -5px;
`;

const SelectionHandleRight = styled(SelectionHandle)`
  right: -5px;
`;

function WaveSelection({ audioPlayedId }) {
  const selectionCanvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const dispatch = useDispatch();

  const { selectedStart, selectedEnd } = useSelector(
    state => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const drawSelection = () => {
    const canvas = selectionCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const handleWidth = 6;
    const leftHandleX = selectedStart * width - handleWidth / 2;
    const rightHandleX = selectedEnd * width - handleWidth / 2;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(100, 100, 100, 0.6)";
    ctx.fillRect(0, 0, leftHandleX, height);
    ctx.fillRect(
      rightHandleX + handleWidth,
      0,
      width - (rightHandleX + handleWidth),
      height
    );

    ctx.fillStyle = "#6bb9f0";
    ctx.fillRect(leftHandleX, 0, handleWidth, height);
    ctx.fillRect(rightHandleX, 0, handleWidth, height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftHandleX + handleWidth / 2, 0);
    ctx.lineTo(leftHandleX + handleWidth / 2, height);
    ctx.moveTo(rightHandleX + handleWidth / 2, 0);
    ctx.lineTo(rightHandleX + handleWidth / 2, height);
    ctx.stroke();
  };

  const handleMouseDown = event => {
    const canvas = selectionCanvasRef.current;
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const handleWidth = 4;
    const leftHandleX = selectedStart * canvas.width - handleWidth / 2;
    const rightHandleX = selectedEnd * canvas.width - handleWidth / 2;

    const threshold = 50;

    const startDistance = Math.abs(x - leftHandleX);
    const endDistance = Math.abs(x - rightHandleX);

    if (startDistance <= threshold) {
      setDragging("start");
    } else if (endDistance <= threshold) {
      setDragging("end");
    } else {
      setDragging(null);
    }
  };

  const handleMouseMove = event => {
    if (!dragging) return;

    const canvas = selectionCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const position = x / canvas.width;

    if (dragging === "start") {
      dispatch(
        setSelectedStart({
          audioPlayedId,
          selectedStart: Math.min(Math.max(0, position), selectedEnd),
        })
      );
    } else {
      dispatch(
        setSelectedEnd({
          audioPlayedId,
          selectedEnd: Math.max(Math.min(1, position), selectedStart),
        })
      );
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(null);
    }
  };

  useEffect(() => {
    drawSelection();
  }, [selectedEnd, selectedStart]);

  return (
    <>
      <canvas
        ref={selectionCanvasRef}
        width="1350"
        height="100"
        style={{ position: "absolute", top: 0, left: 0 }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      <SelectionHandleLeft onMouseDown={e => handleMouseDown(e, "left")} />
      <SelectionHandleRight onMouseDown={e => handleMouseDown(e, "right")} />
    </>
  );
}

export default WaveSelection;
