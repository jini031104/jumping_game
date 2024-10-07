# 웹 소켓 게임 만들기
### 개요
---
웹 소켓을 이용해 "점핑 액션 게임"을 구현했다.

서버와  클라이언트가 데이터를 주고 받아 점수와 현재 스테이지, 아이템 등을 검증한다.


### 기술 스택
---
- Node.js
- Express.js

## 프로젝트 실행

1. 의존성 설치
```
npm install
```

2. 실행
```
npm run dev
```

## 데이터
1. 스테이지
```
{ "id":  1000, "score": 0, "scorePerSecond": 1 },
{ "id":  1001, "score": 30, "scorePerSecond": 2 },
{ "id":  1002, "score": 150, "scorePerSecond": 4 },
{ "id":  1003, "score": 300, "scorePerSecond": 8 },
{ "id":  1004, "score": 450, "scorePerSecond": 16 },
{ "id":  1005, "score": 700, "scorePerSecond": 32 },
{ "id":  1006, "score": 900, "scorePerSecond":64 }
```

2. 아이템
```
{ "id":  1, "score": 10, "width": 30, "height": 30, "image": "/images/items/pokeball_red.png" },
{ "id":  2, "score": 20, "width": 30, "height": 30, "image": "/images/items/pokeball_yellow.png" },
{ "id":  3, "score": 30, "width": 30, "height": 30, "image": "/images/items/pokeball_purple.png" },
{ "id":  4, "score": 40, "width": 30, "height": 30, "image": "/images/items/pokeball_cyan.png" },
{ "id":  5, "score": 50, "width": 30, "height": 30, "image": "/images/items/pokeball_orange.png" },
{ "id":  6, "score": 60, "width": 30, "height": 30, "image": "/images/items/pokeball_pink.png" }
```

3. 아이템이 해금되는 조건
```
{ "id":  101, "stage_id": 1001, "item_id": 1 },
{ "id":  201, "stage_id": 1002, "item_id": 2 },
{ "id":  301, "stage_id": 1003, "item_id": 3 },
{ "id":  401, "stage_id": 1004, "item_id": 4 },
{ "id":  501, "stage_id": 1005, "item_id": 5 },
{ "id":  601, "stage_id": 1006, "item_id": 6 }
```

## 아이템 생성 과정
1. 아이템은 0 ~ 10초 사이마다 생성된다.
2. 아이템이 생성될 떄, 현재 스테이지 ID를 알 수 있으며, 해당 값을 기준으로 아이템이 생성된다.
3. 만약 현재 스테이지 ID가 1003이면, 아이템은 1 ~ 3 중 하나를 랜덤으로 생성한다.

## 검증 진행 과정
유저가 각 스테이지마다 몇 초 동안 유지했는지 계산. 해당 값을 기준으로 각 스테이지에서 제공하는 점수를 1차로 계산.

이후 유저가 먹은 아이템을 파악. 해당 아이템의 종류에 따라 제공되는 점수를 다시 2차로 계산.


## 트러블 슈팅
### 배경
다음 스테이지로 넘어갈 때, 플레이어가 지금까지 거쳐온 스테이지 정보가 제대로 저장되지 않음을 발견.

### 문제점
이렇게 되면 추후 획득한 점수의 검증을 진행할 때, 제대로 된 검증을 할 수 없게 된다.

### 해결 과정
디버깅을 통해 클라이언트와 서버가 제대로 연결되지 않아 발생하는 문제임을 인지.

유저의 uuid가 제대로 전달되지 않고 있었다.

그래서 index.js 마지막 부분에 socket.on('connect')을 추가하여, 연결이 정상적드로 된 경우에만 게임을 실행할 수 있도록 코드를 추가했다.