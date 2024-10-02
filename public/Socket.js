import { CLIENT_VERSION } from "./Constants.js";

// 해당 주소로 연결을 하겠다.
const socket = io('http://localhost:3000/', {
    query: {
        // connection에선 클라이언트 버전은 체크되지 않는다.
        // 따라서 최소 connection 맺을 때라도 버전을 알기 위해 사용된다.
        clientVersion: CLIENT_VERSION
    }
});

// 로직이 끝났을 때 response라는 이름으로 반환을 했으므로...
let userId = null;
socket.on('response', (data) => {
    console.log(data);
});

// 서버에서 connection 이벤트가 발생되어 메시지가 오면,
// 클라이언트에서도 메시지를 받아야 하기 때문에
// connection라는 이름으로 메시지를 받는다.
socket.on('connection', (data) => {
    console.log('connection_Client: ', data);
    userId = data.uuid;
});

// event라는 이름으로 무조건 메시지를 보내고,
// handlerId를 통해 어떤 핸들러에서 처리가 될 지 서버에서 결정되기 때문에
// 클라이언트에서도 똑같이 처리한다.
const sendEvent = (handlerId, payload) => {
    console.log(`sendEvent: ${userId}`);
    socket.emit('event', {
        userId,
        clientVersion: CLIENT_VERSION,
        handlerId,
        payload
    });
};

export {sendEvent};