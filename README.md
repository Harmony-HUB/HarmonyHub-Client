# 🎶 HARMONY-HUB

# Deploy

[사용 하기](#https://gleeful-figolla-ac39e2.netlify.app)

<div align="center">
웹브라우저에서 업로드한 음원을 사용하여 간단한 인터페이스를 이용해

음원을 재생, 편집, 녹음, 저장 등 다양한 기능을 제공하는 **_웹 음원 편집 어플리케이션_** 입니다.
</div>

# 미리보기

![Harmony-HUB](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/a6872f41-930e-42d3-87e8-5f8dbf970ee3)

# 목차

- [개발 동기](#개발-동기)
- [개발 과정](#개발-과정)
  - [1. 오디오 시각화](#1.-오디오-시각화)
    - [음원 파일을 디지털 데이터로 변환하기](#음원-파일을-디지털-데이터로-변환하기)
    - [시각화를 위한 데이터 찾기](#시각화를-위한-데이터-찾기)
    - [시각화 도구 선택하기](#시각화-도구-선택하기)
    - [Canvas와 Float32Array를 조합해 오디오 파형 시각화하기](#Canvas와-Float32Array를-조합해-오디오-파형-시각화하기)
    - [어떻게해야 진폭이 캔버스의 높이를 넘지 않을까?](#어떻게해야-진폭이-캔버스의-높이를-넘지-않을까?)
  - [2. 오디오 파형을 이용한 음원 구간 선택하기](#2.-오디오-파형을-이용한-음원-구간-선택하기)
    - [마우스 드래그 이벤트 구현하기](#마우스-드래그-이벤트-구현하기)
    - [Element 뷰포인트의 상대값을 이용해 이벤트 정확성 높이기](#Element-뷰포인트의-상대값을-이용해-이벤트-정확성-높이기)
  - [3. 음원 트리밍 & 결합 기능 구현하기](#3.-음원-트리밍-&-결합-기능-구현하기)
    - [음원 트리밍](#음원-트리밍)
    - [음원 결합](#음원-결합)
    - [음원 결합 기능을 구현하며 만난 이슈](#음원-결합-기능을-구현하며-만난이슈)
  - [4. 정확한 `Progress Bar` 기능 구현](#4.-정확한-`Progress-Bar`-기능-구현)
    -  [ProgressBar의 위치를 계산하고 업데이트 하기](#ProgressBar의-위치를-계산하고-업데이트-하기)
    -  [애니메이션 표현하기](#애니메이션-표현하기)
- [기능](#기능)
- [사용 기술](#사용-기술)
- [Tone.js 사용 이유](#Tone-js-사용-이유)
- [개발 기간](#개발-기간)
- [Repository Link](#Repository-Link)

# 개발 동기

<div align="center">
첫 개인 프로젝트를 아이템을 준비하며 하게된 가장 큰 생각은 <br>
<b>"내가 좋아하는것과 연관있는걸 해보자!"</b> 였습니다. <br>
평소 음악 듣는것을 좋아하여 음악과 관련된 웹사이트를 개발하고 싶었고 이에 따라 웹 음원 편집 사이트를 개발했습니다.<br>
다만 일반적인 음원 편집 사이트는 도전적인 요소가 다소 부족할 것이라고 생각해<br>
<em><b>외부 라이브러리 의존을 최소화</b></em> 하여 개발 하는것을 목표로 했습니다.
</div>

# 개발 과정

## 1. 오디오 시각화 <br>

### _음원 파일을 디지털 데이터로 변환하기_ <br><br>

### decodeAudioData() <br>

음원의 정보를 획득해 이에 따른 시각화 작업을 진행하기 위해서는 파일을 데이터로 변환하는 작업이 필요했습니다. WEB Audio API가 제공하는 `decodeAudioData()`를 사용해 오디오 디코딩을 진행했습니다. `decodeAudioData()`의 파라미터가 `arrayBuffer`였기 때문에 `fetch API`의 `arrayBuffer`매서드를 사용해서 음원 파일을 변환했습니다.

⬇️ 파일을 디코딩한 오디오 버퍼 데이터 

<img width="216" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/92c8c02c-5f64-46f0-8092-db9e6bb763b5">

### 시각화를 위한 데이터 찾기<br>

음원이 담고있는 정보는 예상했던 것보다 훨씬 다양했습니다. 음원의 채널 수, 샘플레이트, 음원의 길이 등등. 그러나 일반적으로 생각했을때 음원의 상태를 가장 다이나믹하게 시각화 할 수 있는 음정, 진폭, 볼륨 데이터를 찾을 수 없었습니다.
분명 MDN 문서에서 **"Audio Buffer는 오디오 에셋을 나타낸다."** 라고 명시되어있기 때문에 여기에 제가 찾는 데이터가 있다고 생각하고 각각의 속성들 더 나아가 메서드들을 조사해 보았고 그 결과 getChnnelData()를 찾아냈습니다.

### getChnnelData() <br>

`getChnnelData(0)` 는 음원의 0번 째 채널의 Float32Array가 반환됩니다. 이 배열의 각 요소는 이 배열의 각 요소는 시간에 따른 **소리의 진폭을  -1.0 부터 1.0 사이의 값**으로 나타내고 있습니다. 이를 통해 시각화 하기 적합한 음원 데이터를 획득할 수 있었습니다.

---

### _시각화 도구 선택하기_ <br>

### Canvas API VS SVG <br>

시각화를 위한 도구는 크게 Canvas API, SVG 2가지 였습니다. 프로젝트에 많은 영향을 줄것 같은 요소들을 비교해보니 아래와 같은 표가 나왔고, 

<br>

| 기능 / 특징      | Canvas API                                     | SVG                                           |
| ---------------- | ---------------------------------------------- | --------------------------------------------- |
| 렌더링 방식      | 비트맵 그래픽                                  | 벡터 그래픽                                   |
| 그래픽 변경      | 전체 캔버스를 다시 그림                        | 개별 요소의 속성변경 가능                     |
| 해상도           | 고정                                           | 확장 가능                                     |
| 대량 데이터 처리 | 효율적 (픽셀 수준의 접근으로 빠른 렌더링 가능) | 비효율적 (DOM 요소가 많아지면 성능 저하 가능) |

<br>

이러한 특징을 바탕으로 제 프로젝트에 적용해 보니 아래와 같은 결과가 나왔습니다.

<br>

| 기능 / 특징        | Canvas API                                                           | SVG                                                                                                                        |
| ------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 오디오 데이터 표현 | 픽셀 단위의 그래픽으로 빠르게 오디오 데이터를 표현할 수 있음         | 복잡한 그래픽 구조를 통해 오디오 데이터를 표현 가능하지만 대규모 데이터에 대한 처리는 느릴 수 있음                         |
| 이벤트             | 라이브러리나 추가 코드를 이용하여 캔버스 위에서의 위치를 계산해야 함 | 개별 요소에 직접 이벤트 핸들러를 붙일 수 있어 좀 더 세밀한 제어 가능                                                       |
| 렌더링 성능        | 대규모 데이터 또는 복잡한 애니메이션에 더 우수한 성능을 보임         | 복잡한 형태의 그래픽이나 텍스트를 화면 크기에 따라 깨끗하게 확장시키는 데 우수하지만, 대량의 데이터 처리에는 적합하지 않음 |

<br>

이렇게 각 기술의 장단점을 비교해본 결과 Canvas API 사용이라는 결론이 나왔습니다. <br>

1. 오디오 데이터의 시각화와 대량 데이터 처리에 관한 우수한 성능 때문입니다. **오디오 데이터는 일반적으로 매우 대량이며, 이러한 대량의 데이터를 효과적으로 렌더링하고 변형하는 데 Canvas API가 더 적합**합니다.

2. **Canvas API는 비트맵 그래픽을 사용하여 픽셀 수준에서 그래픽을 제어할 수 있습니다. 이는 오디오 파형이나 스펙트럼과 같이 대량의 데이터를 빠르게 렌더링하고 업데이트하는 데 매우 유용**합니다.

3. 또한, 오디오 데이터의 **빠른 시각화**가 필요한 프로젝트에서는 성능이 중요한 요소라고 생각했습니다. Canvas는 이러한 대량의 데이터를 신속하게 처리하고 렌더링하는 데 SVG보다 더 뛰어납니다.

반면에, SVG는 벡터 기반의 그래픽을 제공하므로, 복잡한 형태의 그래픽을 그리거나 확장하는 데 더 적합하지만, 대량의 데이터를 처리하는 데는 비효율적일 수 있습니다. 또한, SVG는 개별 요소에 직접 이벤트 핸들러를 추가할 수 있어서 세밀한 제어가 가능하지만, 이 프로젝트의 경우에는 그렇게 세밀한 제어가 필요하지 않았습니다.

따라서, **프로젝트의 주요 요구 사항과 가장 잘 맞는 기술이 Canvas API**였고 이를 사용해 구현하게 되었습니다.

---

### _실제 렌더링 속도 비교_ <br>

SVG

![Jul-04-2023 20-44-18](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/95885456-2669-468a-b7ad-8538389d0d70)

Canvas

![Jul-04-2023 20-41-59](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/132e3e3e-d323-40b9-aef2-0898a93ab4d6)

---

### _Canvas와 Float32Array를 조합해 오디오 파형 시각화하기_

Float32Array의 요소는 특정 시간에 대한 오디오 샘플 값을 나타내며, 이 값은 -1.0에서 1.0 사이의 범위에 있습니다. 이 값은 Waveform에 그릴 특정 포인트의 진폭(amplitude)을 나타냅니다.

⬇️ Float32Array

<img width="280" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/681f7776-8b7e-4a64-be47-0f40fac367e1">
<img width="256" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/302a3e6b-2b12-4350-a510-1cc575a5568a">

<br><br>

첫번째로 useRef를 이용해서 캔버스의 크기를 측정하고, 캔버스의 x좌표를 음원의 진행시간 y좌표를 소리의 진폭으로 표현하는 방향으로 개발을 진행했습니다.

<br>

```js
const canvas = waveformCanvasRef.current;
const ctx = canvas.getContext("2d");
const { width, height } = canvas;

// 계산된 진폭에 따라 그래프를 그립니다.
for (let i = 0; i < width; i += 1) {
  const min = Math.min.apply(null, data.slice(i * step, (i + 1) * step));
  const max = Math.max.apply(null, data.slice(i * step, (i + 1) * step));
  ctx.lineTo(i, (1 + min) * amplitude);
  ctx.lineTo(i, (1 + max) * amplitude);
}
```
<br>

이 과정을 거쳐 시각화를 하니 이런 결과가 출력됐습니다.

<br>

![image](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/ef7fa619-c5d2-4011-9361-96c2934ee8fa)

물론 x좌표는 음원의 길이를, y좌표는 소리의 절댓값을 잘 표현했지만, 각 샘플의 절댓값이 캔버스의 height보다 클 경우 그래픽이 잘려 보이는 상황이 발생했습니다.
여기서 각 샘플의 절댓값은 해당 샘플의 진폭을 나타내며, 이는 소리의 크기를 나타냅니다. 그러므로 이 값이 캔버스의 높이를 초과하면 그래픽이 잘리게 됩니다.
따라서 캔버스의 높이에 따라 y좌표의 데이터를 조정해야 했습니다.

---

### _어떻게해야 진폭이 캔버스의 높이를 넘지 않을까?_

가장 먼저 떠올랐던 아이디어는 그리려는 데이터의 범위를 캔버스의 높이로 나누는 것이었습니다. 이렇게 하면 그리려는 데이터의 최대값이 캔버스의 높이를 넘지 않게 될 것입니다.
하지만, 여기서 한 가지 문제점이 있습니다. 그리려는 데이터의 최대값이 항상 1이라는 보장이 없었습니다. 

그래서 그리려는 데이터에서 최대값을 찾아 그 값으로 나누는 방법을 생각해 내었습니다.
이렇게 하면 그리려는 데이터의 최대값이 1이 되고, 다른 모든 값들은 0과 1 사이의 값이 됩니다. 그리고 이 값을 다시 캔버스의 높이로 곱하면,그리려는 데이터의 범위가 캔버스의 높이를 넘지 않게 됩니다.

```js
// scaleFactor 적용
const scaleFactor = maxAmplitude > 1 ? 1 / maxAmplitude : 1;

for (let i = 0; i < width; i += 1) {
  const min = Math.min.apply(null, data.slice(i * step, (i + 1) * step));
  const max = Math.max.apply(null, data.slice(i * step, (i + 1) * step));
  ctx.lineTo(i, (1 + min * scaleFactor) * amplitude);
  ctx.lineTo(i, (1 + max * scaleFactor) * amplitude);
}
```

값을 적용하니 이렇게 원하는 결과를 얻을 수 있었습니다.  <br>

![image](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/5beb8fb7-7d8e-4dc4-8d6f-b3045ce902a5)  

### CallStack 에러

오디오 파형 기능을 구현 후 한참동안은 문제가 없다고 생각하고 있었습니다. 하지만 길이가 매우 긴 음원 파일을 업로드 했을 때, "Maximum call stack size exceeded" 문제가 발생하게 되었습니다. 
업로드 파일의 크기를 제한하는 방법도 있었지만 근본적인 이유를 찾아보고싶어져 조사를 해보았습니다.

####  "Maximum call stack size exceeded" 에러가 발생하는 이유?

해당 에러를 맞닥드린 후 꽤 당황스러웠습니다. 평소에는 단순히 call stack 에러는 재귀호출에서 주로 발생한다고 생각하고 있었기 때문입니다. 하지만 제 함수에는 재귀 함수가 없었기 때문에 어느 부분을 봐야하는지 감도 잡히지 않았습니다.
하지만 길이가 긴 파일을 마운트 했을 때 발생하는 에러 라는것이 자명했기 때문에 이를 토대로 이유를 찾아보았습니다.

함수의 반복 사용? - 웨이브 폼을 그리는 `drawWave` 함수는 `audio buffer` 마운트 시 딱 1번만 실행됐습니다. 그래서 이 생각은 바로 넘어갔습니다.

for loop? - 함수 실행이 없는 for loop 에서는 콜스택에 프레임이 쌓일 일이 당연히 없었습니다. 하지만 처음에는 for loop 안에는 진폭의 최댓값과, 최솟값을 표현하기 위해 `apply`를 사용하고 있었고, 이 메서드가 호출 될 때 마다 스택프레임이 
계속 생성된 결과로 해당 에러가 발생하는 것 이라고 생각했습니다. 따라서 `apply`를 메서드를 더 깊게 조사해 보았습니다.

`apply`를 조사해보니 결과적으로 저의 예상은 빗나갔지만, 해당 MDN문서에서 이유를 찾을 수 있었습니다. JavaScript 엔진의 인수 길이 제한을 초과하는것에 주의해야한다. 이는 엔진에 따라 갯수의 차이가 있다. `apply` 메서드는 입력 받는 배열의 크기에 따라 해당 에러가 발생할 수 있었던 것입니다. 2시간 가량의 배열 데이터 때문에 `apply` 메서드에서 에러가 발생한 것이었습니다.

따라서 다른 방법을 시도하고 조사해야 했습니다.

1. `spread` 문법

첫 번째로는 배열의 최대, 최소를 구할 수 있는 `Math.max(...arr)` 을 사용해 소리의 진폭을 표현해 보았지만 같은 이유로 에러가 발생했습니다. 마찬가지로 입력 배열의 데이터가 너무 큰 이유였습니다.

2. `reduce` 메서드

다음은 reduce를 사용해서 최대, 최소 진폭을 표현했습니다. 결과는 `reduce`메서드를 사용하니 더 이상 에러가 발생하지 않았습니다. `reduce`메서드는 내부적으로 반복문을 통해 구성되어 있기 때문에, 스택 프레임을 생성하지 않습니다.
**그리고 `reduce`는 입력 배열을 직접 받는것이 아니고 메서드로 써 순회하기 요소를 하나하나 순회하기 때문에 입력배열에 따른 에러가 발생하지 않았습니다.**
이에 따라 `reduce`메서드를 사용해 시각화 기능을 최적화 시켰습니다. 

<br><br>

## 2. 음원의 구간 선택하기

![구간선택](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/b06f1d58-f9b2-493e-b614-9c5689a7840b)

### _마우스 드래그 이벤트 구현하기_ <br><br>

마우스 드래그 이벤트를 구현하는 것은 이번 개인적으로는 도전적인 일이었습니다. <br>
평소에는 마우스 이벤트라고 하면 클릭과 호버 이벤트를 주로 사용했었기 때문에, 드래그 이벤트가 어떻게 작동하는지 조사하는 것이 필요했습니다.

### onMouse VS onDrag <br><br>

조작 UX 개선을 위해 드래그 이벤트 구현을 위항 이벤트 선택지는 `onMouse`이벤트와 `onDrag` 두가지가 있었습니다. <br>이 둘의 장단점을 비교해 보면 아래와 같은 표가 나옵니다

<br>

|기능 | onMouse | onDrag |
| --- | --- | --- |
| 이벤트 발생 조건| 마우스 클릭 / 이동/ 클릭해제| 클릭 후 마우스 이동 |
| 기본 동작| 없음 | 드래그 "그림자 " 생성 및 이동|
| 이벤트 조절 가능성| 상세한 조절 가능 | 시작과 종료 지점에만 조절 가능 (그림자는 조절 불가) |
|사용 가능 요소| 모든 요소에 가능|일부 요소에만 가능 (img, a...)

<br>이 표를 바탕으로 제가 프로젝트에 원하는 방향을 접목하니 최종적으로 아래와 같은  표가 나왔습니다

<br>

| | onMouse | onDrag |
| --- | --- | --- |
| 위치 추적 | 사용자의 마우스 위치를 정확하게 추적 가능 | 드래그 중인 요소의 위치만 업데이트 |
| 실시간 갱신 | 사용자가 마우스를 움직일 때마다 실시간으로 반응 가능 | 사용자가 드래그를 시작하고 끝낼 때만 반응 |
| 제어 | 선택 영역을 상세하게 제어 가능	 | 드래그 시작/끝 위치에 기반한 제어만 가능|
|사용 용이성|핸들 조작이 단순하고 사용하기 쉬움| 드래그 가능한 요소에 제한적 동작|

<br>위치 추적의 정확도가 높다고 표현되는 위의 표를 바탕으로 `onMouse` 이벤트를 선택하게 되었습니다.

<br>

### `onMouseDown`이벤트와 `onMouseMove`이벤트 조합하기 <br><br>

마우스 이벤트에는 드래그라는 직접적인 속성이 없기 때문에, `onMouseDown`과 `onMouseMove` 이벤트의 조합을 통해 드래그 기능을 구현하였습니다.

구현 과정을 생각보다 수월하게 만들어준것은  '상태(State)' 였습니다. 저는 "Start" 및 "End"라는 두 개의 핸들을 구현하였고, 각 핸들에 대해 별도의 상태를 설정하였습니다. 예를 들어, 사용자가 "Start" 핸들을 클릭하면, `dragging` 상태가 "start"로 변경되어서 Start 핸들의 움직임만을 감지하도록 구현하였습니다. <br>

![start](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/7e04dea8-efe5-45d1-94ee-a156d175cb9e)


또한, `onMouseMove` 이벤트 핸들러에서는 `dragging` 상태가 `true`일 때만 이벤트가 실행되도록 조건을 설정하였습니다. 이런 방식으로 두 개의 이벤트를 연동하여, 사용자의 마우스 움직임에 따른 드래그 기능을 구현하였습니다.

이렇게 하나의 상태를 활용해 두가지의 기능을 구현한 것은 재밌는 경험이었고, 코드를 읽을때 피로도가 감소된다고 느꼈습니다. 물론 그때 그때 프로젝트의 구성에 따라 이런 구현 방식은 독이 될수도 있겠지만, 앞으로 적절한 때에 이 방식을 적용하면 괜찮겠다는 생각을 하고 있습니다.<br><br>

### 이벤트 정확성 높이기 <br><br>

마우스 이벤트는 브라우저 화면 전체에 대한 상대값을 나타내기 때문에 이 정보를 그대로 사용하게 되면, 실제 canvas의 위치와 차이가 발생했습니다. 이 때문에 부정확한 마우스 이벤트가 발생했습니다. 

이를 해결하기 위해서는 우선 브라우저 내의 오디오 파형 캔버스 위치를 정확하게 잡아내는것이 우선이라고 생각했습니다. 

정확하게 엘리먼트를 잡아내기위해  html의 `getBoundingClientRect`메서드를 활용했습니다. 이 메서드는 요소의 위치와 크기에 대한 정보를 제공했습니다. <br>

<img width="500" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/8704b037-84fb-4104-b408-8964835cf9f6">


이를 이용하여 마우스 이벤트가 발생한 실제 위치를 측정할 수 있었습니다.  <br>

<img width="502" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/16846db0-b6a5-412c-a9cb-78ab710e1f8d">

getBoundingClientRect()는 선택한 요소의 위치(top, bottom, left, right) 및 크기(width, height) 정보를 담은 `DOMRect` 객체를 반환합니다.

 그리고 이 `DOMRect` 객체의 `left` 프로퍼티는 요소의 왼쪽 경계의 위치를 반환합니다. 

따라서 **이벤트가 발생한 클라이언트 x 좌표에서 요소의 왼쪽 경계 위치만큼 차감함으로써**, 마우스 이벤트가 요소 내에서 어디에서 발생했는지를 정확히 계산 했습니다.<br><br>

## 3. 음원 트리밍 & 결합 기능 구현하기

### _적절한 데이터 찾기_ <br><br>

시각화 때와 마찬가지로 이번에도 음원의 편집기능에 대한 적절한 데이터를 찾아야 했습니다. 답은 생각보다 훨씬 간단했습니다.  <br>

_**"Audio Buffer는 오디오 에셋을 나타낸다."**_ <br>

당연하게도 음원을 편집할 때 잘라내는 구간 부분을 제외하고는 손실이 없어야 하기 때문에 오디오 버퍼의 모든요소 가 필요했습니다. 이렇게 오디오 편집에 대한 데이터는 어렵지 않게 찾을 수 있었습니다. <br>

---

### _음원 트리밍_ <br><br>

<br>음원을 자르기 위한 첫 계획은 아래와 같이 세웠습니다. <br>

1. 기존 오디오 버퍼의 `length` 값을 선택한 구간의 `length`값으로 대체한다.
2. 이와 같이 `duration`값을 대체한다.
3. `getChnnelData()`를 사용해 `Float32Array`를 시작과 끝을 순회하며 기존 값을 새로운 값으로 대체한다.
<br>

결과적으로 이러한 계획은 1번 부터 무너졌습니다.

<br>
오디오 버퍼는 실제로 직접 변경할 수 있지만 이것은 오디오 프로세싱 컨텍스트에서 진행중인 재생이나 다른 작업에 문제를 일으킬 수 있습니다.<br>
따라서 보통은 오디오 버퍼의 내용을 바꾸는 것을 피하고, 필요한 경우 새로운 오디오 버퍼를 만드는 것을 권장하는 내용을 읽게 되었습니다. <br>
해당 기능을 구현 당시에는 당장 다른 작업에서 문제가 발생할 만한 이유가 없었지만, 향후 애플리케이션의 확장에 걸림돌아 될 수 있는 이슈를 방지하기 위해 다른 방법을 찾기로 했습니다.

따라서 Web Audio API에서 제공하고 있는 `createBuffer`메서드를 사용해 새로운 버퍼를 생성하는 방향으로 진행하게 되었습니다. <br><br>

### `audioContext.context.createBuffer()` <br><br>

`createBuffer` 메서드를 처음 사용하면서, `duration`이라는 오디오 파일의 길이를 초 단위로 나타내는 파라미터가 빠져있어 조금 당황스러웠습니다. 그러나 결과적으로는 이러한 사항이 오히려 개발 과정을 더욱 수월하게 만들었습니다.

왜냐하면 createBuffer 메서드는 샘플의 개수에만 의존하여 동작하므로, `duration`을 제외한 속성들만을 입력하면 메서드가 자동으로 `duration`을 계산하여 설정해주었기 때문입니다. 이런 점 덕분에 별도로 `duration`을 계산하는 코드를 작성하지 않아도 되었고, 샘플의 개수를 더 유연하게 다루면서 정밀한 구현을 가능하게 했습니다.
<br>
```js
const newBuffer = audioContext.context.createBuffer(
  audioBuffer.numberOfChannels,
// 빠져있는 duration 속성
  Math.floor((selectedEnd - selectedStart) * audioBuffer.length),
  audioBuffer.sampleRate
);
```
<br>

이는 사소해 보일 수 있는 일이지만, **프로그래밍에서는 무의미하게 발생하는 일이 없다는 것을 다시 한 번 깨달은 순간이었습니다.**

이후로는, 선택한 영역의 샘플을 비율로 계산해 `length` 값에 입력하고, 이에 따라 새로운 버퍼에 기존 버퍼의 선택 영역의 `Float32Array`를 순회하며 값을 복사하는 과정을 거쳐 음원 자르기 기능을 완성했습니다.

그리고 이전에 참고했던 웹사이트에서는 오디오 트리밍 후 직관적으로 바로 반영되지 않아서 작업 완료 여부를 판단하기 어려웠던 점을 고려하여, 편집 상태를 체크하는 상태 값을 설정하고 오디오 파형을 그리는 함수에 조건을 추가했습니다. 이를 통해 오디오가 편집된 경우에는 바로 오디오 파형이 다시 그려지게 만들어 사용자에게 시각적인 피드백을 제공함으로써 직관성을 높였습니다. <br><br>

⬇️ 참고 사이트의 편집기능 <br>

![Jul-05-2023 18-49-00](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/da63e35c-847f-4111-8620-938cd03c3cd2) <br> 
 
⬇️ 시각적 피드백 제공 <br>

![Jul-05-2023 18-50-57](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/a209c023-2d32-48ff-9165-b2b543e28ca3) <br>

<br><br>

---

### _음원 결합_ <br><br>

### 오디오 버퍼와 음원 결합 조건 <br><br>

사전조사를 했을 때 각각 오디오 버퍼간 결합을 위해서는 조건이 2개 있었습니다.

1. `samplerate` 일치 <br>

샘플레이트는 각각 음원의 용도마다 표준이 정해져있어서 음원을 결합하려면 샘플레이트를 맞춰주는 작업이 필요했습니다. <br><br>
이것은 프로젝트를 진행하기 전부터 알고있던 사실입니다. 하지만 개발을 하며 이상한 점이 있었는데 어떤 음원파일을 업로드 하더라도, 심지어 직접 녹음한 데이터를 오디오 버퍼로 변환할 때도 항상 같은 `samplerate`값이 나오는 것이었습니다. <br><br>

### 왜 모든 음원이 같은 샘플레이트를 가지고 있을까? <br><br>

조사해본 결과 이유는 `decodedAudioData()` 메서드 때문이었습니다. 이 메서드는 음원 파일이나 녹음 데이터를 오디오 버퍼로 변환 하기 위해 꼭 거쳐야하는 관문같은 것인데, 이 관문을 거치면 어떤 샘플레이트라도 고정값으로 변환됐습니다. <br><br>
심지어 보통 리샘플링 작업은 음원의 품질을 낮추는게 일반적인데 `decodedAudioData()`는 고급 리샘플링 알고리즘을 사용하여 품질을 최대한 유지합니다. 이 덕분에 생각보다 수월하게 작업을 진행할 수 있었습니다.

1. 채널 수 일치

⬇️ 각각 다른 음원들의 같은 샘플레이트<br>

<img width="644" alt="image" src="https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/67c52cf2-db83-41f2-8018-0d55e0cd3828">

---

<br><br>
**음원 결합은 크게 두 가지 방법으로 구분됩니다.**
<br><br>

1. **오디오 믹싱** (결합된 음원을 동시에 재생) - 음원에 따른 녹음기능 구현 <br><br>
2. **트랙 레이어링** (결합된 음원을 순차적으로 재생) - 음원 트랙 결합기능 구현 <br><br>

이번 프로젝트에서는 사용자와 일반 음원의 결합과 음원들 간의 순차적 결합 이 두가지 결합 기능을 모두 구현하게 되었습니다. 

### 오디오 믹싱 <br>

#### 녹음 데이터 변환하기 <br>

사용자가 업로드한 음원에 맞추어 녹음을 진행하기 위해 "오디오 믹싱" 기능을 구현하게 되었습니다. 오디오 믹싱은 트랙 레이어링에 비해 상대적으로 간단했습니다. 이는 여러 음원을 동시에 재생하기 때문에, 오직 채널을 합성하는 과정만 필요하기 때문입니다.

그러나 `MediaRecorder`와 오디오 버퍼는 서로 직접적으로 상호 작용할 수 없기 때문에, `MediaRecorder`를 이용하여 얻은 녹음 데이터를 오디오 버퍼로 변환하는 과정이 필요했습니다.

음원 파일을 `decodedAudioData`를 이용하여 오디오 버퍼로 변환하는 과정에서 `ArrayBuffer`로의 변환 작업이 필요하다는 사실을 알고 있었으므르, 녹음 데이터를 `ArrayBuffer`로 변환하는 방법을 찾아보게 되었습니다.

1. `MediaRecorder`로부터 녹음 데이터 얻기 <br>
`dataavailable` 이벤트를 통해 녹음 데이터를 얻을 수 있습니다. 이 이벤트가 발생하면, 이벤트 객체의 `data` 속성을 통해 녹음 데이터에 접근할 수 있습니다. 여기서 얻은 데이터는 `Blob` 형식입니다.

2. FileReader 객체 사용하기 <br>
`Blob` 데이터를 `ArrayBuffer`로 변환하기 위해, `FileReader`의 `readAsArrayBuffer` 메서드를 사용합니다.

3. 마지막으로, `ArrayBuffer` 데이터를 `decodedAudioData`에 전달하여 `AudioBuffer`로 변환합니다.<br>

⬇️ 데이터 변환 과정 <br>

```js
const recordedBlob = new Blob(recordedChunks, { type: "audio/webm" });
const recordedURL = URL.createObjectURL(recordedBlob);
setRecordedAudioURL(recordedURL);
const reader = new FileReader();
reader.onload = async e => {
  const arrayBuffer = e.target.result;
  const audioBuffer = await audioContext.current.decodeAudioData(
    arrayBuffer
  );
  recordedBuffer.current = audioBuffer;
};
```
<br>

#### 오디오 결합하기 <br>

1. 새로운 오디오 버퍼 생성<br>
2. 두 버퍼 중 긴 길이를 새로운 오디오 버퍼의 `length`로 설정<br>
3. 채널과 샘플레이트 값을 할당<br>

이러한 과정을 통해 오디오 믹싱 기능을 성공적으로 구현하였습니다.<br>

### 트랙 레이어링 <br>

초기 구현 시에는, 각 트랙의 오디오 버퍼를 순차적으로 결합하는 아이디어를 사용했습니다. 이를 위해 형식화 배열로 나타내어진 각 오디오 버퍼의 채널을 순회하며, 이들의 길이를 추적하고, 이후에 다음 오디오 버퍼를 결합하는 방식을 사용했습니다. 하지만 이 방법은 결합해야 하는 배열이 길어질수록 성능 문제를 일으켰습니다.

이 문제를 해결하기 위해, 우리는 형식화 배열의 `set` 메서드를 활용하여 최적화를 수행했습니다. 초기에는 새로운 버퍼를 생성하고, `currentPosition`이라는 변수를 사용하여 각 오디오 버퍼의 길이를 추적했습니다. 이 변수는 각 버퍼의 길이를 누적하여 저장하게 됩니다.

이후에는 `buffers.forEach()` 메서드를 사용하여 각 버퍼를 순회하면서 `outputData.set(inputData, currentPosition)`를 호출했습니다. 이 방식은 `outputData`의 현재 위치(currentPosition)에서 `inputData`를 순차적으로 복사하게 되는데, 이를 통해 여러 오디오 버퍼가 단일 버퍼 내에서 순차적으로 연결되어 결합됩니다.

```js
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
```

결과적으로, 형식화 배열의 `set` 메서드를 활용하는 이 방법은 배열의 길이가 커지더라도 성능을 유지하면서 오디오 버퍼를 효과적으로 결합할 수 있었습니다. 이를 통해, 오디오 트랙의 결합 기능을 성공적으로 최적화할 수 있었습니다.

---

### _음원 결합 기능을 구현하며 만난 이슈_ <br><br>

1. 멀티 트랙 구현으로 인한 문제점 <br>
음원의 결합 기능을 구현하기 이전에는 단일 트랙 위주로 개발을 진행했습니다. 컴포넌트 간 prop 드릴링을 피하고, 상태 관리를 더 유연하게 하기 위해 리덕스를 사용했습니다. 그러나 멀티 트랙을 구현한 후, 상태가 글로벌로 관리되면서 모든 트랙이 동일한 상태를 공유하게 되는 문제가 발생했습니다.<br><br>

![Jul-07-2023 15-20-11](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/7d5f283b-ae29-41aa-9cd8-e59e1c9d8b22)

<br>

2. 각 필드에 id 부여<br>
상태 공유 문제를 해결하기 위해 각 필드에 고유한 id를 부여하여 각각의 상태가 공유되지 않도록 했습니다.<br><br>
3. 음원 결합에 대한 추가적인 문제<br>
각 필드에 id를 부여해 트랙의 상태 공유 문제를 해결하였으나, 음원을 결합하려면 모든 트랙을 관리하는 상위 컴포넌트에서 결합 기능을 구현해야 했습니다. 그러나 id는 개별 컴포넌트에서 무작위로 생성된 값이었기 때문에, 상위 컴포넌트에서는 각 id 값을 알 수 없었습니다.<br><br>

지금 돌이켜보면, 당시의 문제점은 다음과 같습니다 <br>

1. id가 무작위 값일 필요는 없었지만, id는 반드시 고유해야 한다고 생각하여 무작위 값으로 생성하여 부여했습니다. 컴포넌트의 key값과 혼동하고 있었습니다. <br>
2. 코드의 구조 설계가 충분히 고려되지 않았습니다. <br>
3. 당시에는 이 문제에 대한 해결 방법이 떠오르지 않아 고민을 많이 했습니다. <br>

이 문제를 해결하기 위해 동료에게 자세한 상황 설명 후 도움을 요청했고, 그 조언을 바탕으로 상위 컴포넌트에서 필드에 직접 id 값을 명시하고 각각의 상태를 관리하는 방식으로 개발을 진행하였습니다. <br><br>

---

### 문제를 해결하며 느끼게된 점 <br><br>

지금 돌이켜보면 간단한 문제였지만 당시에는 해결하지 못할것같은 문제처럼 느껴졌습니다. 이러한 경험을 토대로 풀리지 않을것 같은 문제도 현재의 상황, 심리상태, 그리고 잘못된 배경 지식으로 인하여 알고보면 간단한 문제일 수 있다는 것을 알게 되었습니다. <br> <br>
**상황에서 한 발짝 물러서 상황을 볼 수 있는 동료라는 존재는 큰 힘이 될 수 있다는 것을 다시 한 번 깨닫는 경험이었습니다.** <br><br>

## 4. 정확한 `Progress Bar` 기능 구현

### _음원의 진행상황에 따른 Progress Bar 애니메이션 구현하기_ <br><br>

![Progress Bar](https://github.com/Harmony-HUB/HarmonyHub-Client/assets/121784425/f3606e85-f038-412d-8e13-3c0e0a5e4481)

<br><br>

**음원의 진행상황에 따른 프로그레스바를 정확하게 구현하기 위한 전략을 2가지로 나눴습니다.**

---

### _ProgressBar의 위치를 계산하고 업데이트 하기_ <br><br>

첫 번째 단계에서는 음원의 현재 재생 위치를 해야 했습니다. AudioContext의 `currentTime`을 사용해 현재 재생위치를 추적하는 용도로 사용했습니다. **정확한 재생 위치는 시작 시간과 일시 정지 시간을 차감해서 계산**하였고, 이 값은 음원의** 총 길이에 대한 퍼센트로 변환** 했습니다. <br><br>
이렇게 계산된 퍼센트는 전체 ProgressBar의 위치를 나타내게 됩니다.<br><br>
음원의 재생 상태가 변경될 때마다 이 updateProgress 함수를 호출하여 현재 진행률을 계산하고, 이를 상태로 저장했습니다. 이는 오디오 재생이 시작되거나 재생 위치가 변경될 때마다 발생하므로, ProgressBar는 항상 음원의 현재 재생 위치를 정확하게 반영할 수 있습니다.<br>
`const progress = (currentTime / audioBuffer.duration) * 100;`
<br><br>

### _애니메이션 표현하기_ <br><br>

애니메이션을 표현하기 위해서 progress bar로 표현한 캔버스를 그리고 지우는 작업을 반복했습다. 상태가 업데이트 될 때 마다 함수를 호출 하고, 이 전에 그렸던 캔버스를 지우는것을 반복해서 사용자의 눈에 애니메이션처럼 보이는 효과를 구현했습니다.

초기에는 프로그레스바를 `setInterval`을 사용해 지속적으로 업데이트를 했습니다. 애니메이션이 자연스럽게 진행되고 오차도 없었기 때문에 문제가 전혀 없어 보였습니다. <br>
하지만 재생시간이 긴 음원을 재생하게되면 시간이 지날수록 점점 재생시간과 progress bard의 위치간 오차가 생기는 이슈가 발생했습니다. 해당 문제를 해결하기 위해 `setInterval`을 다시 조사 해보게 되었고, <br>
`setInterval`과 함께 웹페이지 애니메이션 구현시 가장 많이 사용되는 `requestAnimationFrame`도 함께 조사를 진행했습니다.

아래는 두 함수의 조사 결과입니다.

### `setInterval`

#### 1. `setInterval`은 JavaScript의 웹 API 중 하나로, 지정된 시간 간격마다 주어진 함수를 실행한다. 그러나 `setInterval`이 완벽하게 정확한 타이밍을 보장하는 것은 아니다. <br><br>

"JavaScript는 싱글 스레드 언어이기 때문에 `setInterval` 자체는 웹 API에서 실행 되지만, `setInterval`의 콜백 함수는 JavaScript 메인 스레드에서 실행되기 때문에 복잡한 작업이나 기타 이벤트가 메인 스레드를 차지하고 있으면, setInterval 콜백이 예상한 시간에 실행되지 않을 수 있다. 이러한 지연은 작은 차이로 시작할 수 있지만, 시간이 지남에 따라 축적되어서 부정확성을 높일 수 있다."  <br>

#### 2. `setInterval`은 지정된 시간 간격을 "최소"로 보장할 뿐, 실제로 콜백이 실행되는 정확한 시간을 보장하지 않는다. 즉, 지정된 시간이 지나더라도 `setInterval` 콜백이 즉시 실행되는 것은 아니다.  <br> <br>

이 때문에, 오래동안 `setInterva`l을 사용하여 `ProgressBar`를 업데이트하면, 실제 오디오 재생 상태와 `ProgressBar`의 상태 사이에 차이가 생길 수 있다.

오차가 발생하는 상황이 `setInterval`과 Javascript의 구조적인 문제였기 때문에, 

그 결과 `requestAnimationFrame` 라는 함수를 알게 되었고 이를 사용하여 애니메이션을 최적화를 시도했습니다.

### `requestAnimationFrame` <br>

`requestAnimationFrame`은 웹 브라우저의 화면 갱신 주기에 맞추어 애니메이션을 수행하는 JavaScript 메서드이다. 메서드는 레파인트(reflow)와 리페인트(repaint)를 최소화하며, 브라우저의 화면 갱신 주기와 동기화되어 애니메이션을 수행한다. 일반적으로 이 화면 갱신 주기는 초당 60회로, 대부분의 **웹 브라우저와 컴퓨터의 디스플레이 주사율이 일치**한다.

그 결과, requestAnimationFrame을 이용하면 setInterval보다 더 정확한 타이밍을 얻을 수 있으며, 프레임 당 정확한 업데이트가 필요한 애니메이션 등의 처리에 유용하다.

이 메서드를 이용하여 프로그레스 바 업데이트와 같은 애니메이션을 화면 갱신 주기와 동기화시키면, 더 부드럽고 자연스러운 애니메이션 효과를 얻을 수 있다.

이렇게 비교해본 결과 해당 프로젝트에 `requestAnimationFrame` 메서드가 적합하다는 것과 오차를 줄일 수 있겠다고 생각하게 되었고 이를 활용해 `setInterval`함수를 대체하여 애니메이션 효과를 대체했습니다.

 <br>

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
 <br>

이런 방식으로 ProgressBar의 표시를 음원의 실제 재생 상태와 더욱 정확하게 일치시킬 수 있었습니다. requestAnimationFrame 함수를 사용함으로써 브라우저의 리페인트 주기에 맞추어 ProgressBar의 업데이트를 최적화하였고 이는 ProgressBar의 부드럽고 정확한 동작을 보장했습니다. 결과적으로, 이 과정을 통해 사용자에게 더욱 정교하고 실시간적인 오디오 재생 경험을 제공할 수 있게 되었습니다.

 <br> <br>

# 기능

- 브라우저에 있는 음원파일을 업로드하여 재생할수 있습니다.
- 업로드한 음원의 템포, 피치를 조절 할 수 있습니다.
- 업로드한 음원의 구간을 선택하여 자를 수 있습니다.
- 편집한 음원들끼리 음원을 결합할 수 았습니다.
- 업로드한 음원을 배경음으로 음성을 녹음할 수 있습니다.
- 녹음한 음원을 바로 들을 수 있습니다.
- 편집한 음원을 로컬 저장소 또는 본인 계정에 저장 할 수 있습니다.

# 사용 기술

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

  라이브러리를 최대한 쓰지 않고 구현하는것이 목표였기 때문에 Tone.js 쓰게 되는것은 한편으로 아쉬웠습니다. 다만, 어쩔 수 없이 쓰게된 라이브러리일 지라도 향후 애플리케이션의 확장과 더 나은 사용자 경험 개선을 위해 현재 프로젝트에 적합한 라이브러리를 선택해야 했습니다. 선택한 이유는 아래와 같습니다.
  
  1. Tone.js 는 WEB Audio API기반으로 이루어진 라이브러리이기 때문에 크로스 브라우징이슈를 방지 할 수 있습니다.
  2. 이퀄라이저, 미디, 사운드이펙트 등 다양한 오디오 기능을 제공합니다.
  3. 문서화가 잘 되어있어 학습곡선이 타 라이브러리에비해 낮습니다.

이러한 내용들을 바탕으로 Tone.js를 사용하게 되었습니다.
  
## Backend

- Node.js
- Express.js
- AWS S3
- MongoDB Atlas / Mongoose
- ESLint

# 개발 기간

- 프로젝트 기간: 2023.04.03(월) ~ 2023.04.28(금)
- 1 주차: 기획 및 설계
- 2~3 주차: 기능 개발
- 4 주차: 테스트코드 작성, 발표

# Repository Link

[Frontend](https://github.com/Harmony-HUB/HarmonyHub-Client)

[Backend](https://github.com/Harmony-HUB/HarmonyHUB-Server)

# 회고


