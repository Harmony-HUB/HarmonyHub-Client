import { useDrag } from "react-dnd";

function DraggableWaveform({
  audioPlayedId,
  audioBuffer,
  startTime,
  selectedEnd,
  children,
}) {
  const [, drag] = useDrag(() => ({
    type: "WAVEFORM",
    item: {
      audioPlayedId,
      audioBuffer,
      startTime,
      endTime: selectedEnd * audioBuffer.duration,
    },
  }));

  return <div ref={drag}>{children}</div>;
}

export default DraggableWaveform;
