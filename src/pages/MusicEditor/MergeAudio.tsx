import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import Button from "../../components/common/Button/Button";
import Spinner from "../../components/common/Spinner/Spinner";
import { setCombinedAudioBuffer } from "../../feature/musicEditorSlice";

function MergeAudio(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useDispatch();

  const audioBuffers = useSelector((state: RootState) => {
    const { instances } = state.audioPlayer;
    return [0, 1, 2, 3, 4].map(index => instances[index]?.audioBuffer || null);
  });

  function concatenateAudioBuffers(buffers: Array<AudioBuffer>) {
    if (buffers.length === 0 || buffers.some(buffer => buffer === null)) {
      if (process.env.NODE_ENV !== "production") {
        console.error("유효하지 않은 입력값입니다.");
      }

      return null;
    }

    const { numberOfChannels, sampleRate } = buffers[0];

    const totalLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0);

    const outputBuffer = new AudioBuffer({
      length: totalLength,
      numberOfChannels,
      sampleRate,
    });

    let currentPosition = 0;

    buffers.forEach(buffer => {
      for (let channel = 0; channel < numberOfChannels; channel += 1) {
        const outputData = outputBuffer.getChannelData(channel);
        let inputData;

        if (buffer.numberOfChannels > channel) {
          inputData = buffer.getChannelData(channel);
        }

        inputData = buffer.getChannelData(0);
        outputData.set(inputData, currentPosition);
      }
      currentPosition += buffer.length;
    });

    return outputBuffer;
  }

  const handleMergeAudioClick = async () => {
    const nonNullBuffers = audioBuffers.filter(
      (buffer): buffer is AudioBuffer => buffer !== null
    );

    if (nonNullBuffers.length >= 2) {
      setIsLoading(true);

      await new Promise(resolve => {
        setTimeout(resolve, 2000);
      });

      const newCombinedBuffer = concatenateAudioBuffers(nonNullBuffers);
      dispatch(setCombinedAudioBuffer(newCombinedBuffer));

      setIsLoading(false);
    }
  };

  return isLoading ? (
    <Spinner />
  ) : (
    <Button
      width="100px"
      backgroundColor="#ffffff"
      onClick={handleMergeAudioClick}
    >
      음원 결합
    </Button>
  );
}

export default MergeAudio;
