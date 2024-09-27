import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';

let gameAssets = {};

// import.meta.url = 현재 파일의 절대 경로. 즉, assets.js의 위치
const __filename = fileURLToPath(import.meta.url);
// 현재 파일이 위치한, 파일 이름을 제외한 경로. 즉, 위에서 디렉토리 경로만 추출
const __dirname = path.dirname(__filename);
// 최상위 경로 + assets 폴더
const basePath = path.join(__dirname, '../../assets');

// 파일 읽기
// 비동기 병렬로 파일을 읽는다.(하나만...)
const readFileAsync = (filename) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
            if(err) {
                reject(err);
                return ;
            }
            resolve(JSON.parse(data));
        });
    });
};

// readFileAsync가 파일을 하나만 읽을 수 있기 때문에,
// promise.all을 사용해 한번에 읽을 수 있도록 한다.
// 서버가 실행되자마자 바로 같이 호출되어야 한다.
export const loadGameAssets = async () => {
    try {
        const [stages, items, itemUnlocks] = await Promise.all([
            readFileAsync('stage.json'),
            readFileAsync('item.json'),
            readFileAsync('item_unlock.json')
        ]);

        gameAssets = {stages, items, itemUnlocks};
        return gameAssets;
    } catch (error) {
        throw new Error('Failed to load game assets: ' + error.message);
    }
};

export const getGameAssets = () => {
    return gameAssets;
};