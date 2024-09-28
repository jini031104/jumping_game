const users =[];

// 서버 메모리에 유저의 세션(소켓ID) 저장
// 이때, 유저는 users에 객체 형태로 저장
// { uuid: string; socketId: string; };
export const addUser = (user) => {
    users.push(user);
};

// 접속 해제한 경우, 배열에서 유저 삭제
export const removeUser = (socket) => {
    const index = users.findIndex((user) => user.socket === socket);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
};

// 전체 유저 조회
export const getUsers = () => {
    return users;
};