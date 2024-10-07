import { getGameAssets } from "../init/assets.js";

const totalScoreCalculate = (stages, currentStages, userGetItem) => {
    const {items} = getGameAssets();
    let totalScore = 0;
    let serverTime = 0;

    for(let i=0; i<currentStages.length; i++) {
        if(i === currentStages.length - 1) { 
            serverTime = Date.now();  // 현재 시간
        }
        else
            serverTime = currentStages[i + 1].timestamp;

        let currentStage = currentStages[i];
        let time = (serverTime - currentStage.timestamp) / 1000;
        console.log(currentStage, ' time: ', time);
        totalScore += time * stages.data[i].scorePerSecond;
    }

    const itemsArray = items.data;
    totalScore += userGetItem.reduce((sum, id) => {
        const item = itemsArray.find(i => i.id === id);  // id에 맞는 item 찾기
        return sum + (item ? item.score : 0);  // item이 존재하면 score 더하기
    }, 0);

    return totalScore;
}

export default totalScoreCalculate;