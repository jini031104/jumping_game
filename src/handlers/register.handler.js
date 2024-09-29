// 이벤트 처리하는 핸들러
import {v4 as uuidv4} from 'uuid';
import {addUser} from '../models/user.model.js';
import { handleConnection, handleDisconnect, handlerEvent } from './helper.js';

// io는 웹 소켓 객체
const registerHandler = (io) => {
    // connection이라는 이벤트가 발생할 때까지 대기하겠다.
    io.on('connection', (socket) => {
        // 유저가 막 접속했을 시점
        const userUUID = uuidv4();  // UUID 생성
        addUser({uuid: userUUID, socketId: socket.id}); // 사용자 추가

        // 접속 시 유저 정보 생성 이벤트 처리
        handleConnection(socket, userUUID);

        // 이벤트가 발생할 때 처리
        socket.on('event', (data) => handlerEvent(io, socket, data));
        // 접속 해제 시 이벤트 처리
        socket.on('disconnect', () => handleDisconnect(socket, userUUID));
    });
};

export default registerHandler;