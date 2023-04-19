import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { setSelectedStart, setSelectedEnd } from "../feature/audioPlayerSlice";

const SelectionHandle = styled.div`
  position: absolute;
  top: -50%;
  width: 10px;
  height: 200%;
  cursor: col-resize;
  z-index: 1000;
`;

const SelectionHandleLeft = styled(SelectionHandle)`
  left: -5px;
`;

const SelectionHandleRight = styled(SelectionHandle)`
  right: -5px;
`;

function WaveSelection({ selectedStart, selectedEnd, setSelectionActive }) {
  const selectionCanvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const dispatch = useDispatch();

  const drawSelection = () => {
    const canvas = selectionCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const { width, height } = canvas;

    const handleWidth = 4;
    const leftHandleX = selectedStart * width - handleWidth / 2;
    const rightHandleX = selectedEnd * width - handleWidth / 2;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, leftHandleX, height);
    ctx.fillRect(
      rightHandleX + handleWidth,
      0,
      width - (rightHandleX + handleWidth),
      height
    );

    ctx.fillStyle = "#0047AB";
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

  const handleMouseDown = (event, handleType) => {
    const canvas = selectionCanvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;

    const handleWidth = 4;
    const leftHandleX = selectedStart * canvas.width - handleWidth / 2;
    const rightHandleX = selectedEnd * canvas.width - handleWidth / 2;

    const threshold = 5;

    const startDistance = Math.abs(x - leftHandleX);
    const endDistance = Math.abs(x - rightHandleX);

    if (startDistance <= threshold) {
      setDragging("start");
      setSelectionActive(true);
    } else if (endDistance <= threshold) {
      setDragging("end");
      setSelectionActive(true);
    } else {
      setDragging(null);
    }

    if (handleType === "left") {
      setDragging("start");
      setSelectionActive(true);
    } else if (handleType === "right") {
      setDragging("end");
      setSelectionActive(true);
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
      dispatch(setSelectedStart(Math.min(Math.max(0, position), selectedEnd)));
    } else {
      dispatch(setSelectedEnd(Math.max(Math.min(1, position), selectedStart)));
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      setDragging(null);
      setSelectionActive(false);
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
