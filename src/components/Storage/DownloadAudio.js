import React from "react";
import wav from "audiobuffer-to-wav";
import Button from "../common/Button/Button";

function DownloadAudio({ audioBuffer }) {
  const bufferToWavBlob = buffer => {
    const wavData = wav(buffer);
    const blob = new Blob([new Uint8Array(wavData)], { type: "audio/wav" });
    return blob;
  };

  const handleDownload = () => {
    if (!audioBuffer) return;

    const blob = bufferToWavBlob(audioBuffer);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `audio_${audioBuffer}.wav`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button onClick={handleDownload} disabled={!audioBuffer}>
      내 컴퓨터에 저장하기
    </Button>
  );
}

export default DownloadAudio;
