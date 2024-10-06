import { getGameAssets } from "../init/assets.js";
import { getStage, setStage } from "../models/stage.model.js";
import {getItem} from '../models/item.model.js'
import totalScoreCalculate from './score.handler.js';

export const moveStageHandler = (userId, payload) => {
    // 유저의 현재 스테이지 배열을 가져온다.
    const currentStages = getStage(userId);
    // console.log(userId);
    // console.log(currentStages.length);
    // console.log("currentStages: ");
    // console.log(currentStages); 
    if(!currentStages.length) {
        return {status: 'fail', message: 'No stages found for user(stage handler)'};
    }

    // 유저의 현재 스테이지 ID를 가져온다
    currentStages.sort((a, b) => a.id - b.id);
    const currentStage = currentStages[currentStages.length - 1];

    // 서버 vs 클라이언트 비교
    if(currentStage.id !== payload.currentStage) {
        return {status: 'fail', message: 'Current stage missmatch'};
    }

    // targetStage에 대한 검증 <= 게임 에셋에 존재하는 스테이지인가.
    const {stages} = getGameAssets();
    if(!stages.data.some((stage) => stage.id === payload.currentStage)) {
        return {status: 'fail', message: 'Target stage does not exist'};
    }

    // 점수 검증
    let score = totalScoreCalculate(stages, currentStages, getItem(userId));
    let stage_index = 0;
    stages.data.map((item, index) => {
        if(item.id === payload.targetStage) {
            stage_index = index;
        }
    });

    // if(score < stages.data[stage_index].score - 0.5 || score > stages.data[stage_index].score + 1) {
    //     return {status: 'fail', message: 'Invalid elapsed time'};
    // }

    const serverTime = Date.now();  // 현재 시간
    console.log('next stage');
    setStage(userId, payload.targetStage, serverTime);
    return {status: 'Success', message: 'Next stage!'};
};