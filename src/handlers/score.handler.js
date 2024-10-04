const totalScoreCalculate = (stages, currentStages) => {
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
        console.log(currentStage, ' time: ', time, ' score: ', stages.data[i].scorePerSecond);
        totalScore += time * stages.data[i].scorePerSecond;
    }
    
    console.log(`totalScore: ${totalScore}`);
}

export default totalScoreCalculate;