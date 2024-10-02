import express from "express";
import { createServer } from 'http';
import initSocket from "./init/socket.js";
import { loadGameAssets } from "./init/assets.js";

const app = express();
const server = createServer(app);   // 이걸 이용해 서버를 키고, 웹 소켓도 연결하는 등 이것저것 할 것이다.

const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());
// "query string"(일명 qs) 라이브러리로 URL-encoded 데이터를 파싱할지(true) 안 할지에 대한 설정
app.use(express.urlencoded({extended: false}));
initSocket(server);

app.get('/', async(req, res) => {
    res.send('<h1>Hello World?</h1>');
});

server.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);

    // 이곳에서 파일을 읽음
    try {
        const assets = await loadGameAssets();
        console.log(assets);
        console.log('Assets loaded successfully');
    } catch(error) {
        console.log('Failed to load game assets: ' + error);
    }
});