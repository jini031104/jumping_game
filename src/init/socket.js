import { Server as SocketIO } from "socket.io";

const initSocket = (server) => {
    const io = new SocketIO();  // 소켓IO 서버 생성
    io.attach(server);          // 서버에 연결
};

export default initSocket;