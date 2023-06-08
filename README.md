# HARMONY-HUB

웹브라우저에서 음원을 업로드하면, 간단한 인터페이스로 음원을 재생, 편집, 녹음, 저장 등 다양한 기능을 제공하는 웹 음원 편집 어플리케이션 입니다.

# INDEX

- [Feature](#Feature)
- [Usage](#Usage)
- [Motivation](#Motivation)
- [Challenge](#Challenge)
  - [Audio Wave](#1)
    - [사용자가 음원을 업로드 했을 때, 어떻게 음원에 따른 파형을 그릴 수 있을까?](###사용자가-음원을-업로드-했을-때,-어떻게-음원에-따른-파형을-그릴-수-있을까?)
  - [오디오 자르기/붙이기](#2)
    - [음원의 어떤 속성을 자르고 붙여야 음원이 손상되지 않게 할 수 있을까?](###음원의-어떤-속성을자르고-붙여야-음원이-손상되지-않게-할-수-있을까?)
  - [Progress Bar](#3)
    - [음원의 진행상황에 따른 Progress Bar 애니메이션 구현하기.](###음원의-진행상황에-따른-Progress-Bar-애니메이션-구현하기.)



# Feature

- 브라우저에 있는 음원파일을 업로드하여 재생할수 있습니다.
- 업로드한 음원의 템포, 피치를 조절 할 수 있습니다.
- 업로드한 음원의 구간을 선택하여 자를 수 있습니다.
- 편집한 음원들끼리 음원을 합칠 수 있습니다.
- 편집한 음원을 로컬 저장소 또는 본인 계정의 서버에 저장 할 수 있습니다.

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

# Motivation

평소 음악을 즐겨들으며 노래를 흥얼흥얼 따라 부르기를 좋아하던 저는 유튜브의 노래방 컨텐츠를 이용하고는 했습니다. 이 컨텐츠를 이용하며 아쉬운점이 있었는데, 너무 노래가 높거나 낮으면 노래방에서 처럼 키를 조절해 노래를 부를 수 없다는것이 아쉬웠습니다. 음원 파일을 갖고있다면 내가 원하는대로 음정을 조절하며 노래를 부를 수 있으면 어떨까? 더 나아가 음원을 내가 원하는 대로 편집 할 수 있으면 어떨까? 라는 생각에서 해당 프로젝트를 기획했습니다.

# Challenge

- 샘플 "샘플"이라는 용어는 디지털 오디오 처리에 널리 사용되며, 이는 아날로그 신호를 디지털 형태로 변환할 때 특정 시간 간격으로 측정한 신호의 강도를 나타냅니다. 오디오 데이터는 여러 샘플들의 연속적인 시퀀스로 구성되어 있습니다. 각 샘플은 특정 시간에 음향 파동의 강도를 나타냅니다

* WEB AUDIO API는 매우 생소한 기능이었습니다.

  ## 1) Audio Wave

  ### 사용자가 음원을 업로드 했을 때, 어떻게 음원에 따른 파형을 그릴 수 있을까?

  1. 파형을 그릴 수 있는 데이터를 어디서 어떻게 취할 수 있을까?

  - fetch API를 이용해서 사용자가 업로드한 파일을 가져온 후, AudioContext의 decodeAudioData 메서드를 이용하여 가져온 파일을 오디오 버퍼로 변환했습니다.
  - 이 오디오 버퍼는 오디오 데이터의 전체 시간 동안 각 채널에 대한 PCM(Pulse Code Modulation) 데이터 샘플을 제공합니다.

  2. Waveform 그리기

  - 추출된 오디오 버퍼를 가지고 나서 웨이브폼을 그리는 작업을 수행하였습니다. 이를 위해 canvas API를 사용하였습니다. 오디오 버퍼의 각 샘플 데이터를 순회하면서 해당 샘플의 최대 및 최소 값을 찾고, 그 값을 캔버스에 선으로 그려 웨이브폼을 생성하였습니다.

  ## 2) 오디오 자르기/붙이기

  ### 음원의 어떤 속성을 자르고 붙여야 음원이 손상되지 않게 할 수 있을까?

  #### 1. 오디오 자르기

  오디오를 자르는 작업은 새로운 오디오 버퍼를 생성하고, 원래의 오디오 버퍼에서 선택한 부분의 샘플들을 새로운 오디오 버퍼에 복사하는 것으로 이루어집니다. 선택한 부분의 시작과 끝 위치는 샘플의 인덱스로 결정됩니다. 그런 다음 새로운 오디오 버퍼가 원래의 오디오를 대체합니다.

  #### 2. 오디오 붙이기

  오디오를 붙이는 작업도 비슷한 프로세스를 거칩니다. 두 개 이상의 오디오 버퍼를 합치려면, 새로운 오디오 버퍼를 생성하고 각 오디오 버퍼의 샘플들을 순서대로 새로운 버퍼에 복사합니다.

  #### 3. 음원 손상 방지

  위의 방법을 사용하면 원래의 오디오 데이터를 손상시키지 않고 오디오를 자르거나 붙일 수 있습니다. 이는 각 샘플이 독립적으로 복사되기 때문에 원래의 데이터가 변형되지 않기 때문입니다. 또한, 새로운 오디오 버퍼를 생성하는 과정에서 오디오 데이터의 품질이 손상되지 않도록 주의해야 합니다. 이를 위해 원래 오디오 데이터와 동일한 샘플링 빈도와 비트 깊이를 사용해야 합니다.

  ### 초기 발생 문제

  #### 1. 샘플링 빈도와 채널 수 일치

  초기에는 두 오디오 클립을 결합할 때 문제가 발생하였습니다. 두 클립의 샘플링 빈도나 채널 수가 일치하지 않으면 이들을 결합하는 것이 복잡해졌습니다. 따라서 모든 클립이 동일한 샘플링 빈도와 채널 수를 가지도록 변환하는 것이 필요하였습니다.

  #### 2. 시간 정확도

  사용자가 오디오를 정확하게 자르기를 원하지만, 초기 버전에서는 이가 완벽하게 정확하지 않았습니다. 이는 샘플링 빈도에 따라 가능한 샘플 위치가 제한되기 때문이었습니다. 따라서 실제로는 사용자가 선택한 시간에 가장 가까운 샘플 위치에서 자르기를 수행하였습니다.

  ## 3) Progress Bar

  ### 음원의 진행상황에 따른 Progress Bar 애니메이션 구현하기.

  #### 1. setInterval vs requestAnimationFrame

  - 처음에는 `setInterval` 함수를 사용하여 `Progress Bar`의 위치를 지속적으로 업데이트하려고 했습니다. 그러나 만약 재생시간이 매우 긴 예를들어 1시간 이상 정도의 음원 파일을 재생시켰을 때, 재생을 진행할 수록 progress bar와 재생 시간과의 정확도가 부정확하다는 문제를 발견했습니다.

  해당 문제가 일어나는 이유는

  ##### 1. `setInterval`은 JavaScript의 웹 API 중 하나로, 지정된 시간 간격마다 주어진 함수를 실행한다. 그러나 `setInterval`이 완벽하게 정확한 타이밍을 보장하는 것은 아니다. 여기에는 두 가지 주요 이유가 있다.

  JavaScript는 싱글 스레드 언어이며, `setInterval` 자체는 웹 API에서 실행 되지만, `setInterval`의 콜백 함수는 JavaScript 메인 스레드에서 실행된다. 이 때문에 복잡한 작업이나 기타 이벤트가 메인 스레드를 차지하고 있으면, setInterval 콜백이 예상한 시간에 실행되지 않을 수 있다. 이러한 지연은 작은 차이로 시작할 수 있지만, 시간이 지남에 따라 축적되어서 부정확성을 높일 수 있다.

  ##### 2. `setInterval`은 지정된 시간 간격을 "최소"로 보장할 뿐, 실제로 콜백이 실행되는 정확한 시간을 보장하지 않는다. 즉, 지정된 시간이 지나더라도 `setInterval` 콜백이 즉시 실행되는 것은 아니다.

  이 때문에, 오래동안 `setInterva`l을 사용하여 `ProgressBar`를 업데이트하면, 실제 오디오 재생 상태와 `ProgressBar`의 상태 사이에 차이가 생길 수 있다.

  저는 이를 해결하기 위해 `requestAnimationFrame` 함수를 사용하여 애니메이션을 최적화하였습니다. `requestAnimationFrame` 함수는 브라우저가 다음 리페인트를 수행하기 전에 특정 함수를 호출하도록 요청합니다. 따라서 브라우저의 리페인트 주기에 맞추어 애니메이션을 업데이트할 수 있습니다.

  #### 2. 음원의 진행률에 따른 `ProgressBar`를 `Waveform`위에 정확하게 그리기

  - 음원의 재생 상태가 변경될 때마다 `ProgressBar`의 위치를 업데이트 해야 했습니다. 이를 위해 음원의 재생 상태를 추적하고, 상태가 변경될 때마다 `ProgressBar`를 다시 그리는 방식을 사용했습니다. 이를 위해, 현재 재생 위치를 percentage로 계산하고, 이 값을 `ProgressBar` 컴포넌트에 전달하여, 진행 상황에 따라 그릴 위치를 업데이트했습니다.

