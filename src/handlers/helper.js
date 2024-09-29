import { CLIENT_VERSION } from '../constants.js';
import {getUsers, removeUser} from '../models/user.model.js';
import handlerMappings from './handlerMapping.js';

export const handleDisconnect = (socket, uuid) => {
    removeUser(socket.id);  // 사용자 삭제
    console.log(`User disconnected: ${socket.id}`);
    console.log(`Current users: ${getUsers()}`);
};

export const handleConnection = (socket, uuid) => {
    console.log(`New user connected ${uuid} with socket ID ${socket.id}`);
    console.log(`Current users: ${getUsers()}`);    // 현재 접속 중인 유저들의 전체 정보

    // gameStart()로 이동
    // // 서버 메모리에 있는 게임 에셋에서 stage 정보를 가지고 온다.
    // const {stages} = getGameAssets();
    // // stages 배열의 0번째 = 첫번째 스테이지
    // setStage(uuid, stages.data[0].id);
    // console.log(`Stage: ${getStage(uuid)}`);

    // emit 메서드로 해당 유저에게 메시지를 전달할 수 있다.
    // 현재의 경우 접속하고 나서 생성된 uuid를 바로 전달하고 있다.
    socket.emit('connection' + {uuid: uuid});
};

// data = payload
export const handlerEvent = (io, socket, data) => {
    // 서버에 저장된 클라이언트 배열에서 메시지로 받은 clientVersion을 확인한다.
    if(!CLIENT_VERSION.includes(data.clientVersion)) {
        socket.emit('response', {status: 'fail', message: 'Client version missmatch'});
        return ;
    }

    // 메시지로 오는 핸들러ID에 따라 handlerMappings 객체에서 적절한 핸들러를 찾는다.
    const handler = handlerMappings[data.handlerId];
    if(!handler) {
        socket.emit('response', {status: 'fali', message: 'Handler not found'});
        return ;
    }
    // 적절한 핸들러에 userID와 payload를 전달하고 결과를 받는다.
    const response = handler(data.userId, data.payload);

    // 만약 결과에 broadcast(모든 유저에게 전달)이 있다면, broadcast 한다.
    if(response.broadcast) {
        io.emit('response', 'broadcast');
        return ;
    }
    // 해당 유저에게 적절한 response를 전달한다.
    socket.emit('response', response);
};