import { getGameAssets } from '../init/assets.js';
import {setItem} from '../models/item.model.js'
import { getStage } from '../models/stage.model.js';

export const userGetItemHandler = (userId, payload) => {
    const {items, itemUnlocks} = getGameAssets();
    const {itemId} = payload;

    // 먹은 아이템이 존재하는가?
    if(!items.data.some((itme) => itme.id === itemId)) {
        return {status: 'fail', message: 'This item is No data'};
    }

    // 유저의 현재 스테이지 확인
    const currentStages = getStage(userId);
    if(currentStages.length === 0) {
        return {status: 'fail', message: 'No stages found for user(itme handler)'};
    }
    const currentStageID = currentStages[currentStages.length - 1].id;

    // 지금 먹은 아이템이 현재 스테이지에서 얻을 수 있는가?
    if(!itemUnlocks.data.some((stage) => stage.stage_id === currentStageID)) {
        return {status: 'fail', message: 'No current stage found'};
    }
    let test = 0;
    itemUnlocks.data.map((item, index) => {
        if(item.stage_id === currentStageID) {
            test = index;
        }
    });

    // 현재 아이템 생성은 1 ~ 현재 해금된 아이템ID 사이에서 생성하는 중...
    if(itemUnlocks.data[test].item_id < itemId) {
        return {status: 'fail', message: 'Dont now eat item'};
    }

    setItem(userId, itemId);
    return {status: 'success', message: `item: ${itemId}, userId: ${userId}`};
};