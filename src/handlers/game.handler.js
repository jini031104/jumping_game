import { getGameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
    // 서버 메모리에 있는 게임 에셋에서 stage 정보를 가지고 온다.
    const {stages} = getGameAssets();
    clearStage(uuid);
    console.log(`gameStart: ${uuid}`);
    // stages 배열의 0번째 = 첫번째 스테이지
    // 게임이 시작되는 시간을 넣어준다.
    setStage(uuid, stages.data[0].id, payload.timestamp);
    console.log('Stage: ', getStage(uuid));

    return {status: 'success'};
};

export const gameEnd = (uuid, payload) => {
    // 클라이언트는 게임 종료 시, timestamp와 총 점수를 띄워야 한다.
    // 구조 분해 할당으로 payload를 쪼개어 저장
    // timestamp의 이름을 gameEndTime으로 변경
    const {timestamp: gameEndTime, score} = payload;
    const stages = getStage(uuid);  // 유저의 현재 스테이지

    if(stages.length === 0) {
        return {status: 'fail', message: 'No stages found for user(game handler)'};
    }

    // 각 스테이지의 지속 시간 계산하여 총 점수 계산
    let totalScore = 0;
    stages.forEach((stage, index) => {
        let stageEndTime;
        if(index === stages.length - 1) {
            stageEndTime = gameEndTime; // 스테이지가 끝나는 시간은 게임이 끝나는 시간이다.
        } else {
            // 다음 스테이지의 시작 시간을 스테이지의 종료 시간으로 사용
            stageEndTime = stages[index + 1].timestamp;
        }

        // 해당 스테이지에 있었던 시간
        const stageDuration = (stageEndTime - stage.timestamp) / 1000;
        totalScore += stageDuration; // 일단은 1초당 1점으로 계산
    });

    // 점수와 timestamp를 검증(절대값 사용)
    // 오차범위 5
    if(Math.abs(score - totalScore) > 5)
        return {status: 'fail', message: 'Score verification failed'};

    // 유저 경험을 위해 score는 클라이언트 기준으로...
    // 만약 DB에 저장을 한다면, saveGameResult(userId, clientScore, gameEndTime);을 사용해서...
    console.log('game End!!');
    return {status: 'success', message: 'Game ended successfully', score};
};