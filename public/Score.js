import { sendEvent } from "./Socket.js";
import stageData from '../assets/stage.json' with { type: 'json' };

const stage = stageData.data;

class Score {
  score = 0;
  level = 0;
  HIGH_SCORE_KEY = 'highScore';

  constructor(ctx, scaleRatio, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.itemController = itemController;
  }

  update(deltaTime) {
    // 스테이지 기준으로 점수 획득
    this.score += deltaTime * 0.001 * stage[this.level].scorePerSecond;

    // 준비된 스테이지 데이터 길이보다 작고
    // 다음 단계로 도달하기 위한 점수보다 클 경우
    if(this.level + 1 < stage.length &&
      Math.floor(this.score) >= stage[this.level + 1].score) {
      sendEvent(11, {currentStage: stage[this.level].id, targetStage: stage[this.level + 1].id});
      this.level++;
      this.itemController.setCurrentStage(stage[this.level].id);
    }
  }

  getItem(itemId) { // 아이템을 얻었을 때
    this.score += this.itemController.getItemScore(itemId);
    sendEvent(12, {itemId});
  }

  reset() {
    this.score = 0;
    this.level = 0;
    this.itemController.setCurrentStage(1000);
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);
    this.ctx.fillText(`Level ${this.level}`, highScoreX - 100, y);
  }
}

export default Score;
