import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedStart,
  setSelectedEnd,
} from "../../feature/audioPlayerSlice";
import { SelectionHandleLeft, SelectionHandleRight } from "./styles";
import { PropsId } from "../../types";
import { RootState } from "../../store";

function WaveSelection({ audioPlayedId }: PropsId): React.ReactElement {
  const selectionCanvasRef = useRef<HTMLCanvasElement>(null);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);
  const dispatch = useDispatch();

  const { selectedStart, selectedEnd } = useSelector(
    (state: RootState) => state.audioPlayer.instances[audioPlayedId] || {}
  );

  const drawSelection = () => {
    const canvas = selectionCanvasRef.current;
    if (!canvas) return;
    const ctx = (canvas as HTMLCanvasElement).getContext("2d");
    const { width, height } = canvas;

    const handleWidth = 6;
    const leftHandleX = selectedStart * width - handleWidth / 2;
    const rightHandleX = selectedEnd * width - handleWidth / 2;

    if (!ctx) return;

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

  const handleMouseDown = (event: React.MouseEvent) => {
    const canvas = selectionCanvasRef.current;

    if (!canvas) return;

    const canvasEl = canvas as HTMLCanvasElement;
    const rect = canvasEl.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const handleWidth = 4;
    const leftHandleX = selectedStart * canvasEl.width - handleWidth / 2;
    const rightHandleX = selectedEnd * canvasEl.width - handleWidth / 2;

    const threshold = 30;

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

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!dragging) return;

    const canvas = selectionCanvasRef.current;

    if (!canvas) return;

    const canvasEl = canvas as HTMLCanvasElement;
    const rect = canvasEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const position = x / canvasEl.width;

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
      <SelectionHandleLeft onMouseDown={handleMouseDown} />
      <SelectionHandleRight onMouseDown={handleMouseDown} />
    </>
  );
}

export default WaveSelection;
