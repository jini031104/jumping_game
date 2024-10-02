import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";

export const moveStageHandler = (userId, payload) => {
    // 유저의 현재 스테이지 배열을 가져온다.
    let currentStages = getStage(userId);
    console.log(userId);
    console.log(getStage(userId));
    console.log("currentStages: ");
    console.log(currentStages); 
    if(!currentStages.length) {
        return {status: 'fail', message: 'No stages found for user(stage handler)'};
    }

    // 유저의 현재 스테이지 ID를 가져온다
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];
    //const currentStageId = currentStages[currentStages.length - 1].id;

    // 서버 vs 클라이언트 비교
    console.log(`currentStage.id: ${currentStage.id}, payload.currentStage: ${payload.currentStage}`);
    console.log('-----------', payload);    // 클라이언트 쪽에서 받은 정보
    if(currentStage.id !== payload.currentStage) {
        return {status: 'fail', message: 'Current stage missmatch'};
    }

    // 점수 검증
    const serverTime = Date.now();  // 현재 시간
    const elapsedTime = (serverTime - currentStage.timestamp) / 1000;   // 경과 시간
    console.log('elapseTime: ', elapsedTime);
    // 1 -> 2로 넘어가는 가정
    if(elapsedTime < 10 || elapsedTime > 11) {
        return {status: 'fail', message: 'Invalid elapsed time'};
    }

    // targetStage에 대한 검증 <= 게임 에셋에 존재하는 스테이지인가.
    const {stages} = getGameAssets();
    // console.log('stage_handler_test: ', stages);
    // console.log('test: ', stages.data[2]);
    if(!stages.data.some((stage) => stage.id === payload.targetStage)) {
        return {status: 'fail', message: 'Target stage does not exist'};
    }

    setStage(userId, payload.targetStage, serverTime);
    return {status: 'Success'};
};