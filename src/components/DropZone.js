import { useDrop } from "react-dnd";

function DropZone({ onDrop }) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "WAVEFORM",
    drop: onDrop,
    collect: monitor => ({
      isOver: monitor.isOver(),
    }),
  }));

  const dropZoneStyle = {
    border: "2px dashed #ccc",
    minHeight: "100px",
    padding: "10px",
    backgroundColor: isOver ? "#eee" : "transparent",
  };

  return <div ref={drop} style={dropZoneStyle} />;
}

export default DropZone;
