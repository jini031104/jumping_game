// 유저가 먹은 아이템 기록
const items = {};

export const createItem = (uuid) => {
    items[uuid] = [];
};

export const getItem = (uuid) => {
    return items[uuid];
};

export const setItem = (uuid, itmeInfo) => {
    return items[uuid].push(itmeInfo);
};

export const clearItem = (uuid) => {
    return items[uuid] = [];
}