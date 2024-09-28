// 이벤트 처리하는 핸들러
import {v4 as uuidv4} from 'uuid';
import {addUser} from '../models/user.model.js';
import { handleDisconnect } from './helper.js';

// io는 웹 소켓 객체
const registerHandler = (io) => {
    // connection이라는 이벤트가 발생할 때까지 대기하겠다.
    io.on('connection', (socket) => {
        const userUUID = uuidv4();  // UUID 생성
        addUser({uuid: userUUID, socketId: socket.id}); // 사용자 추가

        // 접속 해제 시 이벤트 처리
        socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    });
};

export default registerHandler;