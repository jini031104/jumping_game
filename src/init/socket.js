import { Server as SocketIO } from "socket.io";
import registerHandler from "../handlers/register.handler.js";

const initSocket = (server) => {
    const io = new SocketIO();  // 소켓IO 서버 생성
    io.attach(server);          // 서버에 연결
    registerHandler(io);        // 클라이언트로부터 오는 이벤트를 처리할 핸들러를 서버에 등록
};

export default initSocket;