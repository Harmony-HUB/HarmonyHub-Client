# 🎶 HARMONY-HUB

<div align="center">
웹브라우저에서 업로드한 음원을 사용하여 간단한 인터페이스를 이용해
  
음원을 재생, 편집, 녹음, 저장 등 다양한 기능을 제공하는 **_웹 음원 편집 어플리케이션_** 입니다.
</div>

# TOC

- [Motivation](#Motivation)
- [Challenge](#Challenge)
  - [Audio Wave](#1-Audio-Wave)
    - [사용자가 음원을 업로드 했을 때, 어떻게 음원에 따른 파형을 그릴 수 있을까?](#사용자가-음원을-업로드-했을-때-어떻게-음원에-따른-파형을-그릴-수-있을까)
  - [오디오 자르기/붙이기](#2-오디오-자르기-붙이기)
    - [음원의 어떤 속성을 자르고 붙여야 음원이 손상되지 않게 할 수 있을까?](#음원의-어떤-속성을-자르고-붙여야-음원이-손상되지-않게-할-수-있을까)
  - [Progress Bar](#3-Progress-Bar)
    - [음원의 진행상황에 따른 Progress Bar 애니메이션 구현하기.](#음원의-진행상황에-따른-Progress-Bar-애니메이션-구현하기)
  - [구간 선택](#4-구간-선택)
- [Feature](#Feature)
- [Usage](#Usage)
- [Tech Stack](#Tech-Stack)
- [Tone.js 사용 이유](#Tone-js-사용-이유)
- [Time Line](#Time-Line)
- [Repository Link](#Repository-Link)
  
# Preview

![Harmony-HUB](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/a6872f41-930e-42d3-87e8-5f8dbf970ee3)


# Motivation

평소 음악을 즐겨 들으며 노래를 따라 부르기를 좋아하던 저는 유튜브의 노래방 컨텐츠를 이용하고는 했습니다. 이 컨텐츠를 이용하며 아쉬운점이 있었는데, 너무 노래가 높거나 낮으면 노래방에서 처럼 키를 조절해 노래를 부를 수 없다는것이 아쉬웠습니다. 음원 파일을 갖고있다면 내가 원하는대로 음정을 조절하며 노래를 부를 수 있으면 어떨까? 더 나아가 음원을 내가 원하는 대로 편집 할 수 있으면 어떨까? 라는 생각에서 해당 프로젝트를 기획했습니다.

# Challenge

  ## 1. Audio Wave

  ### 어떻게하면 사용자가 업로드한 음원으로 음원에 따른 파형을 그릴 수 있을까?

  1. 파형을 그릴 수 있는 데이터 취득하기

  - fetch API를 이용해서 사용자가 업로드한 파일을 가져온 후, AudioContext의 `decodeAudioData` 메서드를 이용하여 가져온 파일을 오디오 버퍼로 변환했습니다.
  - decodeAudioData는 Web Audio API의 일부로, 인코딩된 오디오 파일 데이터를 AudioBuffer로 디코딩합니다. 이 AudioBuffer는 음원을 다루기 위해 필요한 여러 가지 작업을 수행하는데 사용했습니다.
  - 이 오디오 버퍼는 오디오 데이터의 전체 시간 동안 각 채널에 대한 PCM(Pulse Code Modulation) 데이터 샘플을 제공합니다.
  
  ```js
  src/Waveform/Waveform.js
  
  const loadAudioFile = async () => {
    try {
      const response = await fetch(file);
      const audioData = await response.arrayBuffer();
      const newAudioBuffer = await audioContext.decodeAudioData(audioData);
      dispatch(setAudioBuffer({ audioPlayedId, audioBuffer: newAudioBuffer }));
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }
    }
  };

   ```

- "샘플"이라는 용어는 디지털 오디오 처리에 널리 사용되며, 이는 아날로그 신호를 디지털 형태로 변환할 때 특정 시간 간격으로 측정한 신호의 강도를 나타냅니다. 오디오 데이터는 여러 샘플들의 연속적인 시퀀스로 구성되어 있습니다. 각 샘플은 특정 시간에 음향 파동의 강도를 나타냅니다.

audio buffer 객체 ![image](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/962983fc-6191-4c61-b367-37f40236639e)


  2. Waveform 그리기

  - 추출된 오디오 버퍼를 가지고 나서 웨이브폼을 그리는 작업을 수행하였습니다. 이를 위해 Canvas API를 사용하였습니다. 오디오 버퍼의 각 샘플 데이터를 순회하면서 해당 샘플의 최대 및 최소 값을 찾고, 그 값을 캔버스에 선으로 그려 웨이브폼을 생성하였습니다.

```js
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amplitude = height / 2;
```

- `audioBuffer.getChannelData(0)`를 사용하여 첫 번째 오디오 채널의 PCM 데이터를 가져왔습니다. 이 데이터는 배열 형태로 제공되며, 각 요소는 -1과 1 사이의 값입니다. 

<img width="280" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/681f7776-8b7e-4a64-be47-0f40fac367e1">

- `step` 변수에는 화면 너비에 따라 샘플링 빈도를 할당했습니다.
- `amplitude`는 캔버스 높이의 반으로 설정되며, 웨이브폼이 캔버스 중간에서 상하로 그려지도록 하여 상하 대칭구조를 이룰 수 있도록 그림을 그렸습니다.
  
  ```js
    let maxAmplitude = 0;
    for (let i = 0; i < data.length; i += 1) {
      maxAmplitude = Math.max(maxAmplitude, Math.abs(data[i]));
    }
    const scaleFactor = maxAmplitude > 1 ? 1 / maxAmplitude : 1;
   ```
   - 코드는 `data` 배열의 모든 요소를 순회하면서 가장 큰 절댓값을 찾습니다. 이 최대값(maxAmplitude)은 나중에 웨이브폼을 정규화하는 데 사용됩니다. 
   - `scaleFactor`는 웨이브폼이 캔버스 내에서 너무 크지 않게 조정하는 스케일 팩터입니다.

`scaleFactor` 적용 전

![image](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/ef7fa619-c5d2-4011-9361-96c2934ee8fa)



`scaleFactor` 적용 후 

![image](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/5beb8fb7-7d8e-4dc4-8d6f-b3045ce902a5)

```js
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.moveTo(0, amplitude);
```
- clearRect를 사용하여 이전에 그려진 모든 내용을 지웁니다. 
- 그런 다음 새로운 경로를 시작하고, 그리기 시작할 지점을 캔버스의 중간으로 설정합니다. 

```js
    for (let i = 0; i < width; i += 1) {
      const min = Math.min.apply(null, data.slice(i * step, (i + 1) * step));
      const max = Math.max.apply(null, data.slice(i * step, (i + 1) * step));
      const x = i / width;
```
- 캔버스의 각 픽셀에 대해, step만큼 샘플링한 데이터에서 최소값과 최대값을 찾습니다. 이 값들은 웨이브폼을 그릴 때 해당 픽셀의 상하한을 결정합니다. x는 현재 위치를 캔버스의 너비로 정규화한 값입니다.

  ---

  ## 2. 오디오 자르기/붙이기

  ### 음원의 어떤 속성을 자르고 붙여야 음원이 손상되지 않게 할 수 있을까?

  #### 1. 오디오 자르기

  오디오를 자르는 작업은 **새로운 오디오 버퍼를 생성하고**, 원래의 오디오 버퍼에서 **선택한 부분의 샘플들을 새로운 오디오 버퍼에 복사하는 것으로 진행**됩니다. 선택한 부분의 시작과 끝 위치는 샘플의 인덱스로 결정됩니다. 그런 다음 **새로운 오디오 버퍼가 원래의 오디오를 대체**합니다.
  ```js
      const newBuffer = audioContext.context.createBuffer(
        audioBuffer.numberOfChannels,
        Math.floor((selectedEnd - selectedStart) * audioBuffer.length),
        audioBuffer.sampleRate
      );  
  ```

  #### 2. 오디오 붙이기

  오디오를 붙이는 작업도 비슷한 과정을 거쳤습니다. 두 개 이상의 오디오 버퍼를 합치려면, **새로운 오디오 버퍼를 생성하고 각 오디오 버퍼의 샘플들을 순서대로 새로운 버퍼에 복사**합니다.
  
  1. 첫 번째 버퍼에서 필요한 정보인 채널 수와 샘플 속도를 추출합니다. 이는 모든 AudioBuffer가 동일한 속성을 가지고 있다는 가정하에 사용했습니다. 이에 대한 이유는 아래 [샘플링 빈도와 채널 수 일치](#샘플링-빈도와-채널-수-일치)에서 설명합니다.
  ```js
  const { numberOfChannels, sampleRate } = buffers[0];
  ```
  2. 입력으로 주어진 모든 버퍼의 길이를 더해 총 길이를 계산합니다. 
  ```js
  const totalLength = buffers.reduce((acc, buffer) => acc + buffer.length, 0);
  ```
  3. 버퍼의 총 길이, 채널 수, 샘플 속도를 사용하여 새로운 AudioBuffer를 생성합니다.
  ```js
  const outputBuffer = new AudioBuffer({
    length: totalLength,
    numberOfChannels,
    sampleRate,
  });
  ```
  4. 이제 각 입력 버퍼에 대해 반복하여 작업을 수행합니다. 각 버퍼에서 채널 데이터를 가져와 생성한 AudioBuffer에 복사합니다. 이 때, 각 채널 데이터를 복사할 위치는 이전 버퍼 데이터가 복사된 이후 위치입니다. 마지막으로, 생성된 AudioBuffer를 반환합니다.

**초기 발생 문제**

음원의 결합은 문제없이 되는 반면, MediaRecorder를 이용한 녹음 데이터와 일반 음원 데이터를 결합하려고 할 때 결합이 제대로 되지 않는 문제 발생.

**문제 원인**

### 샘플링 빈도와 채널 수 일치

처음에는 사용자의 녹음 데이터와 업로드한 음원 데이터를 결합 하려고 할 때, 기존 음원 데이터간의 결합 기능을 그대로 사용하려고 했습니다. 하지만 결합이 제대로 이루어지지 않는 문제가 발생했습니다. 그 이유는 오디오를 결합하기 위해서는 각 음원의 오디오 버퍼 객체 안에 있는 샘플링 빈도와, 채널의 수가 일치해야 합니다.
초기에 일반 음원끼리 결합을 시도 할 때는 문제가 발생하지 않았던 이유는 무엇일까요? 저는 분명 서로 다른 음원들끼리 결합을 시도 했었습니다. 이유는 다음과 같습니다.
- 음악 파일의 샘플링 빈도는 표준적으로 44.1kHz(44100Hz)가 많이 사용되고, 채널의 수는 2개 입니다.
일반적으로는 샘플레이트와 채널 숫자의 표준값을 정해놓기 때문에 녹음기능을 구현하기 전 음원 결합에는 문제가 없었던 것 이었습니다. 하지만 `MediaRecorder`를 이용한 녹음 파일은 사용자의 장치에 따라 샘플레이트가 다르기 때문에 문제가 발생했습니다.

  **해결 방안**

### 어떻게 서로 다른 음원간 샘플레이트와 채널을 일치 시켜줄 수 있을까?

1. 음원을 임의로 Resampling 하는 방법

   ```js
   function resampleAudioBuffer(audioBuffer, targetSampleRate) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const oldSampleRate = audioBuffer.sampleRate;
    const newSampleRate = targetSampleRate;
    const oldLength = audioBuffer.length;
    const newLength = oldLength * newSampleRate / oldSampleRate;
    const result = new OfflineAudioContext(numberOfChannels, newLength, newSampleRate);

    const bufferSource = result.createBufferSource();
    bufferSource.buffer = audioBuffer;

    bufferSource.connect(result.destination);
    bufferSource.start();

    return result.startRendering().then((resampledBuffer) => {
        return resampledBuffer;
    });
   }
   ```
음원을 리샘플링을 할 경우 결합된 음원의 품질이 낮아진다는것을 발견했습니다. 

이 문제를 해결하기 위해, 각 오디오 클립을 별도의 AudioBuffer에 로드하고 동일한 AudioContext에서 재생하는 방식을 사용하였습니다. 이 방식을 통해, 각 오디오 버퍼의 샘플링 레이트가 서로 다르더라도 AudioContext가 이를 적절하게 처리하여 오디오 클립을 정상적으로 재생할 수 있게 되었습니다.
  
  1. 재생 버퍼 생성 (uploadedBuffer와 recordedBuffer 중 더 긴 길이로 생성)
  ```js
  const combinedBuffer = new AudioBuffer({
    length: Math.max(
      uploadedBuffer.current.length,
      recordedBuffer.current.length
    ),
    numberOfChannels: 2,
    sampleRate: audioContext.current.sampleRate,
  });
  ```
  2. 각각의 AudioBuffer 데이터를 재생 버퍼에 복사
  
  ```js
  combinedBuffer.copyToChannel(uploadedBuffer.current.getChannelData(0), 0);
  combinedBuffer.copyToChannel(recordedBuffer.current.getChannelData(0), 1);
  ```
  3.  생성된 재생 버퍼로 오디오 재생 시작
  ```js
  const bufferSource = audioContext.current.createBufferSource();
  bufferSource.buffer = combinedBuffer;
  bufferSource.connect(audioContext.current.destination);
  bufferSource.start();
  ```

---

  ## 3. `Progress Bar`

  ### 음원의 진행상황에 따른 Progress Bar 애니메이션 구현하기.

  ![Progress Bar](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/f3606e85-f038-412d-8e13-3c0e0a5e4481)
  

  ### 1. `setInterval` vs `requestAnimationFrame`

  - 처음에는 `setInterval` 함수를 사용하여 `Progress Bar`의 위치를 지속적으로 업데이트하려고 했습니다.
  ```js
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        updateProgress();
      }, 10);
  
      return () => {
        clearInterval(interval);
      };
    }
  
    return updateProgress();
  }, [isPlaying]);

  ```
  -  그러나 만약 재생시간이 매우 긴, 예를들어 1시간 이상 정도의 음원 파일을 재생시켰을 때, 재생을 진행할 수록 progress bar와 재생 시간과의 정확도가 부정확하다는 문제를 발견했습니다.

  해당 문제가 일어나는 이유는

  #### 1. `setInterval`은 JavaScript의 웹 API 중 하나로, 지정된 시간 간격마다 주어진 함수를 실행한다. 그러나 `setInterval`이 완벽하게 정확한 타이밍을 보장하는 것은 아니다.

  JavaScript는 싱글 스레드 언어이며, `setInterval` 자체는 웹 API에서 실행 되지만, `setInterval`의 콜백 함수는 JavaScript 메인 스레드에서 실행된다. 이 때문에 복잡한 작업이나 기타 이벤트가 메인 스레드를 차지하고 있으면, setInterval 콜백이 예상한 시간에 실행되지 않을 수 있다. 이러한 지연은 작은 차이로 시작할 수 있지만, 시간이 지남에 따라 축적되어서 부정확성을 높일 수 있다.

  #### 2. `setInterval`은 지정된 시간 간격을 "최소"로 보장할 뿐, 실제로 콜백이 실행되는 정확한 시간을 보장하지 않는다. 즉, 지정된 시간이 지나더라도 `setInterval` 콜백이 즉시 실행되는 것은 아니다.

  이 때문에, 오래동안 `setInterva`l을 사용하여 `ProgressBar`를 업데이트하면, 실제 오디오 재생 상태와 `ProgressBar`의 상태 사이에 차이가 생길 수 있다.

  저는 이를 해결하기 위해 `requestAnimationFrame` 함수를 사용하여 애니메이션을 최적화하였습니다. 
  ```js
  useEffect(() => {
    let animationFrameId;

    const loop = () => {
      updateProgress();
      animationFrameId = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      loop();
    } else {
      updateProgress();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);
  ```
  `requestAnimationFrame` 함수는 브라우저가 다음 리페인트를 수행하기 전에 특정 함수를 호출하도록 요청합니다. 따라서 브라우저의 리페인트 주기에 맞추어 애니메이션을 업데이트할 수 있습니다.

  ### 2. 음원의 진행률에 따른 `ProgressBar`를 `Waveform`위에 정확하게 그리기

  - 음원의 진행 상황에 따른 ProgressBar를 Waveform 위에 정확하게 그리기 위한 구현 전략에 대해 설명하겠습니다. 이 작업은 두 가지 주요 부분으로 나눌 수 있습니다: ProgressBar의 위치를 계산하고 업데이트하는 것과 실제 ProgressBar를 그리는 것입니다.

  - 첫 번째 단계에서는 음원의 현재 재생 위치를 계산합니다. AudioContext의 `currentTime`을 사용해 현재 재생 위치를 파악합니다. 이 재생 위치는 `startTime`과 `pausedTime`을 빼서 계산하였고, 이 값은 음원의 총 길이에 대한 퍼센트로 변환 했습니다. 이렇게 계산된 퍼센트는 전체 ProgressBar의 위치를 나타내게 됩니다.
  - 음원의 재생 상태가 변경될 때마다 이 updateProgress 함수를 호출하여 현재 진행률을 계산하고, 이를 상태로 저장했습니다. 이는 오디오 재생이 시작되거나 재생 위치가 변경될 때마다 발생하므로, ProgressBar는 항상 음원의 현재 재생 위치를 정확하게 반영할 수 있습니다.

  - 두 번째 단계는 실제로 ProgressBar를 그리는 것입니다. 이 작업은 `drawProgress` 함수에서 이루어집니다. 이 함수는 현재 진행률을 기반으로 캔버스 위에 선을 그립니다. ProgressBar의 위치는 **캔버스의 너비와 현재 진행률(퍼센트)을 곱하여 계산**되며, 이 값은 선을 그리는 시작점(x 좌표)이 됩니다.

    ---

## 4. 구간 선택

### Canvas API를 사용하여 구간선택 구현하기.

![구간선택](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/b06f1d58-f9b2-493e-b614-9c5689a7840b)

---

1. 사용자의 마우스 이벤트 정확하게 감지하기.

- **초기 발생 문제**
    사용자가 waveform 캔버스를 클릭 했을 때, startSelection의 핸들만 이동하는 문제 

![Selection Erorr](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/b68a904a-5517-450b-a77b-d41fcb698bba)

- **문제 발생 이유**

  handleMouseDown 함수에서 먼저 startDistance에 가장 가까운지 확인하는 로직이 있기 때문입니다. 
  사용자가 start 핸들과 end 핸들 사이의 위치에서 클릭을 하면 항상 startDistance가 endDistance보다 작거나 같아지므로 start 핸들이 이동하게 됩니다. 가장 먼저 실행되는 `if (startDistance <= endDistance)` 조건이 충족되어 start 핸들만 이동하게 됩니다.

- **해결 방안**

  #### 임계값 설정
  
  `handleMouseDown` 함수에서 `threshold`(임계값)을 설정합니다. 임계값이 없거나 너무 크면 어느 위치에서든 항상 startDistance가 endDistance보다 작거나 같게 되어, 위의 이미지 처럼 start 핸들이
  항상 이동하게 됩니다. 이로 인해 사용자가 end 핸들을 움직이려 해도 start 핸들이 움직이는 문제가 발생할 수 있습니다.
  적절한 임계값을 설정하여 사용자가 핸들 주변의 특정 범위 내에서 클릭하면 핸들을 클릭한 것으로 간주되게 했습니다. 이를 통해 사용자의 손의 미세한 흔들림을 보정하고, 사용자 경험을 개선했습니다.
  
```js
  const handleMouseDown = event => {

    ...

    const threshold = 50;

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
  };
  
```

2. Mouse Events Handling

- **초기 발생 문제**

사용자가 드래그를 시작하거나 종료할 때 발생하는 마우스 이벤트를 처리하는 것이 어려웠습니다. 특히, 사용자가 드래그를 시작하거나 종료하는 시점을 **정확히 감지하는 것**이 중요했습니다. 그러나 마우스 이벤트를 정확히 처리하지 못하면 사용자의 입력에 따라 예상한 대로 반응하지 않는 문제가 발생했습니다.

- **문제 발생 이유**

마우스 이벤트의 위치 정보는 브라우저 화면 전체에 대한 상대적 위치를 반환하므로, 이 정보를 그대로 사용하면 실제 요소의 위치와 차이가 발생했습니다. 즉, 클릭 이벤트의 위치 정보가 실제로 사용자가 클릭한 요소의 위치와 일치하지 않는 문제가 있었습니다.

- **해결 방안**
 
<img width="769" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/8704b037-84fb-4104-b408-8964835cf9f6">


이 문제를 해결하기 위해, HTML 요소의 getBoundingClientRect() 메서드를 사용하여 이벤트 발생 위치를 정확히 파악했습니다. 이 메서드는 요소의 위치와 크기에 대한 정보를 제공하며, 이를 이용하여 마우스 이벤트가 발생한 실제 위치를 측정할 수 있었습니다.

<img width="502" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/16846db0-b6a5-412c-a9cb-78ab710e1f8d">

getBoundingClientRect()는 선택한 요소의 위치(top, bottom, left, right) 및 크기(width, height) 정보를 담은 DOMRect 객체를 반환합니다. 그리고 이 DOMRect 객체의 left 프로퍼티는 요소의 왼쪽 경계의 위치를 반환합니다. 따라서 이벤트가 발생한 클라이언트 x 좌표에서 요소의 왼쪽 경계 위치를 뺌으로써, 마우스 이벤트가 요소 내에서 어디에서 발생했는지를 정확히 계산할 수 있었습니다.


# Feature

- 브라우저에 있는 음원파일을 업로드하여 재생할수 있습니다.
- 업로드한 음원의 템포, 피치를 조절 할 수 있습니다.
- 업로드한 음원의 구간을 선택하여 자를 수 있습니다.
- 편집한 음원들끼리 음원을 결합할 수 았습니다.
- 업로드한 음원을 배경음으로 음성을 녹음할 수 있습니다.
- 편집한 음원을 로컬 저장소 또는 본인 계정에 저장 할 수 있습니다.

# Usage

- Google Auth를 통해서 로그인 합니다.
- 파일 업로드: 파일 선택 버튼을 클릭해서 로컬 저장소에 있는 음원 파일을 업로드합니다.
- 트랙 정렬: 각 트랙의 왼쪽에 있는 화살표 버튼을 이용해서 트랙의 순서롤 조정합니다.
- 트랙 결합: 두 개 이상의 음원이 업로드 되면 "음원 결합하기"버튼이 활성화 됩니다. 버튼을 클릭하여 음원을 결합합니다.
- 음원 저장: 각 트랙에 있는 "SAVE"버튼을 클릭하면 각각의 트랙을 따로 저장 할 수 있고, 음원을 결합 후 하단에 있는 "SAVE"버튼을 클릭하여 편집한 음원을 로컬 저장소 또는 본인 계정의 서버에 저장 할 수 있습니다.
- 음원 듣기: 화면 오른쪽 상단의 "내 음악"버튼을 클릭하면 내가 저장한 음원을 언제나 들을 수 있습니다.
- 녹음하기: 파일을 업로드 후 녹음버튼을 클릭하면 업로드한 음원이 재생됩니다. 재생되는 음원에 맞춰 녹음 후 정지 버튼을 클릭하면 업로드한 음원과 녹음파일이 결합됩니다.
- 녹음 음원 재생: 저장 하기 전 녹음된 음원을 들어 볼 수 있습니다.
- 녹음 음원 저장: 결합된 음원을 서버에 저장 할 수 있습니다.

# Tech stack

## Frontend
- React
- React Router
- Redux-Toolkit
- WEB AUDIO API
- Tone.js
- Styled Components
- ESLint
- Jest

### Tone.js 사용 이유
- 프로젝트 초반에는 Audio관련 라이브러리를 사용하지 않고 해당 프로젝트를 완료하는게 목표였습니다. 하지만 Pitch와 Tempo조절 기능을 구현 할 때, Tone.js 의 힘을 빌리게 되었습니다.
음원의 피치를 올리거나 내리는 방법은 사실 아주 단순합니다. 음원의 재생속도를 빠르게 혹은 느리게 조정하면 됩니다. 우리가 동영상을 볼 때 재생속도를 빠르게 해서 보면 배우들의 목소리가 높아지는 것과 같은 원리입니다.
하지만 이 말은 즉, 피치와 템포는 서로 **강력한 의존성**을 띄고 있다는 말이 됩니다. 이 문제를 해결하기 위해 조사를 해본 결과 `Phase vocoder` 라고 하는 알고리즘이 필요하다는 것을 알게 되었습니다. 해당 알고리즘을 더 조사해보니
신호처리, 수학, 프로그래밍에 대해 전문적인 지식이 필요하다는것을 알게 되었고, 3주라는 시간 안에 이를 구현하기에는 무리가 있겠다는 생각을 하게되었습니다. 이러한 결과로 Tone.js의 힘을 빌려 피치, 템포 조절 기능을 구현했습니다.

## Backend
- Node.js
- Express.js
- AWS S3
- MongoDB Atlas / Mongoose
- ESLint

# Time Line
- 프로젝트 기간: 2023.04.03(월) ~ 2023.04.28(금)
- 1 주차: 기획 및 설계
- 2~3 주차: 기능 개발
- 4 주차: 테스트코드 작성, 발표

# Repository Link
[Frontend](https://github.com/Harmony-HUB/HarmonyHub-Client)

[Backend](https://github.com/Harmony-HUB/HarmonyHUB-Server)
