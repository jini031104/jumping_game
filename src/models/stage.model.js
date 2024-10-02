// 유저의 스테이지 정보를 저장
// key: UUID, value: array -> stage 정보는 배열
const stages = {};

export const createStage = (uuid) => {
    // 스테이지에 대한 정보를 담기 위한 틀
    stages[uuid] = [];  // 초기 스테이지 배열 생성
};

export const getStage = (uuid) => {
    // 현재 스테이지 ID
    return stages[uuid];
};

export const setStage = (uuid, id, timestamp) => {
    // 다음 스테이지 ID
    return stages[uuid].push({id, timestamp});
};

export const clearStage = (uuid) => {
    return stages[uuid] = [];
}