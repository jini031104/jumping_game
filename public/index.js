import Player from './Player.js';
import Ground from './Ground.js';
import CactiController from './CactiController.js';
import Score from './Score.js';
import ItemController from './ItemController.js';
import './Socket.js';
import { sendEvent, socket } from './Socket.js';

import itmeData from '../assets/item.json' with { type: 'json' };

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const GAME_SPEED_START = 1;
const GAME_SPEED_INCREMENT = 0.00001;

// 게임 크기
const GAME_WIDTH = 800;
const GAME_HEIGHT = 200;

// 플레이어
// 800 * 200 사이즈의 캔버스에서는 이미지의 기본크기가 크기때문에 1.5로 나눈 값을 사용. (비율 유지)
const PLAYER_WIDTH = 88 / 1.5; // 58
const PLAYER_HEIGHT = 94 / 1.5; // 62
const MAX_JUMP_HEIGHT = GAME_HEIGHT;
const MIN_JUMP_HEIGHT = 150;

// 땅
const GROUND_WIDTH = 2400;
const GROUND_HEIGHT = 24;
const GROUND_SPEED = 0.5;

// 선인장
const CACTI_CONFIG = [
  { width: 48 / 1.5, height: 100 / 1.5, image: 'images/cactus_1.png' },
  { width: 98 / 1.5, height: 100 / 1.5, image: 'images/cactus_2.png' },
  { width: 68 / 1.5, height: 70 / 1.5, image: 'images/cactus_3.png' },
];

// 아이템
const ITEM_CONFIG = itmeData.data;

// 게임 요소들
let player = null;
let ground = null;
let cactiController = null;
let itemController = null;
let score = null;

let scaleRatio = null;
let previousTime = null;
let gameSpeed = GAME_SPEED_START;
let gameover = false;
let hasAddedEventListenersForRestart = false;
let waitingToStart = true;

function createSprites() {
  // 비율에 맞는 크기
  // 유저
  const playerWidthInGame = PLAYER_WIDTH * scaleRatio;
  const playerHeightInGame = PLAYER_HEIGHT * scaleRatio;
  const minJumpHeightInGame = MIN_JUMP_HEIGHT * scaleRatio;
  const maxJumpHeightInGame = MAX_JUMP_HEIGHT * scaleRatio;

  // 땅
  const groundWidthInGame = GROUND_WIDTH * scaleRatio;
  const groundHeightInGame = GROUND_HEIGHT * scaleRatio;

  player = new Player(
    ctx,
    playerWidthInGame,
    playerHeightInGame,
    minJumpHeightInGame,
    maxJumpHeightInGame,
    scaleRatio,
  );

  ground = new Ground(ctx, groundWidthInGame, groundHeightInGame, GROUND_SPEED, scaleRatio);

  const cactiImages = CACTI_CONFIG.map((cactus) => {
    const image = new Image();
    image.src = cactus.image;
    return {
      image,
      width: cactus.width * scaleRatio,
      height: cactus.height * scaleRatio,
    };
  });

  cactiController = new CactiController(ctx, cactiImages, scaleRatio, GROUND_SPEED);

  const itemImages = ITEM_CONFIG.map((item) => {
    const image = new Image();
    image.src = item.image;
    return {
      image,
      id: item.id,
      width: item.width * scaleRatio,
      height: item.height * scaleRatio,
      score: item.score
    };
  });

  itemController = new ItemController(ctx, itemImages, scaleRatio, GROUND_SPEED);

  score = new Score(ctx, scaleRatio, itemController);
}

function getScaleRatio() {
  const screenHeight = Math.min(window.innerHeight, document.documentElement.clientHeight);
  const screenWidth = Math.min(window.innerHeight, document.documentElement.clientWidth);

  // window is wider than the game width
  if (screenWidth / screenHeight < GAME_WIDTH / GAME_HEIGHT) {
    return screenWidth / GAME_WIDTH;
  } else {
    return screenHeight / GAME_HEIGHT;
  }
}

function setScreen() {
  scaleRatio = getScaleRatio();
  canvas.width = GAME_WIDTH * scaleRatio;
  canvas.height = GAME_HEIGHT * scaleRatio;
  createSprites();
}

setScreen();
window.addEventListener('resize', setScreen);

if (screen.orientation) {
  screen.orientation.addEventListener('change', setScreen);
}

let gameEndCheck = false;
function showGameOver() {
  const fontSize = 70 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 4.5;
  const y = canvas.height / 2;
  ctx.fillText('GAME OVER', x, y);
  if(gameEndCheck) {
    sendEvent(3, {timestamp: Date.now(), score: score, itme: itemController});
  }
}

function showStartGameText() {
  const fontSize = 40 * scaleRatio;
  ctx.font = `${fontSize}px Verdana`;
  ctx.fillStyle = 'grey';
  const x = canvas.width / 14;
  const y = canvas.height / 2;
  ctx.fillText('Tap Screen or Press Space To Start', x, y);
}

function updateGameSpeed(deltaTime) {
  gameSpeed += deltaTime * GAME_SPEED_INCREMENT;
}

let isConnected = false;
function reset() {
  if (!isConnected) {
    console.log('소켓 연결이 완료되지 않았습니다. 게임을 시작할 수 없습니다.');
    return;
  }
  hasAddedEventListenersForRestart = false;
  gameover = false;
  waitingToStart = false; // 이게 있어야 게임이 진행됨...
  gameEndCheck = true;

  ground.reset();
  cactiController.reset();
  score.reset();
  gameSpeed = GAME_SPEED_START;
  const startTime = Date.now();
  sendEvent(2, {timestamp: startTime});  // 게임 시작 핸들러 작동
}

function setupGameReset() {
  if (!hasAddedEventListenersForRestart) {
    hasAddedEventListenersForRestart = true;

    setTimeout(() => {
      window.addEventListener('keyup', reset, { once: true });
    }, 1000);
  }
}

function clearScreen() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop(currentTime) {
  if (previousTime === null) {
    previousTime = currentTime;
    requestAnimationFrame(gameLoop);
    return;
  }

  // 모든 환경에서 같은 게임 속도를 유지하기 위해 구하는 값
  // 프레임 렌더링 속도
  const deltaTime = currentTime - previousTime;
  previousTime = currentTime;

  clearScreen();

  if (!gameover && !waitingToStart) {
    // update
    // 땅이 움직임
    ground.update(gameSpeed, deltaTime);
    // 선인장
    cactiController.update(gameSpeed, deltaTime);
    itemController.update(gameSpeed, deltaTime);
    // 달리기
    player.update(gameSpeed, deltaTime);
    updateGameSpeed(deltaTime);

    score.update(deltaTime);
  }

  if (!gameover && cactiController.collideWith(player)) {
    gameover = true;
    score.setHighScore();
    setupGameReset();
  }
  const collideWithItem = itemController.collideWith(player);
  if (collideWithItem && collideWithItem.itemId) {
    // 아이템 먹었을 때 동작
    score.getItem(collideWithItem.itemId);
  }

  // draw
  player.draw();
  cactiController.draw();
  ground.draw();
  score.draw();
  itemController.draw();

  if (gameover) {
    showGameOver();
    gameEndCheck = false;
  }

  if (waitingToStart) {
    showStartGameText();
  }

  // 재귀 호출 (무한반복)
  requestAnimationFrame(gameLoop);
}

// 게임 프레임을 다시 그리는 메서드
requestAnimationFrame(gameLoop);

// 연결이 완료되었을 때만 게임이 시작되도록 이벤트 리스너 추가
socket.on('connect', () => {
  console.log('소켓 연결 완료');
  isConnected = true;

  // 소켓 연결 후에만 reset 이벤트 리스너 추가
  window.addEventListener('keyup', reset, { once: true });
});