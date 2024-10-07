import Item from "./Item.js";
import Item_Unlock from "../assets/item_unlock.json" with { type: 'json' };

class ItemController {
    INTERVAL_MIN = 0;
    INTERVAL_MAX = 10000;
    currentStage = 1000;
    nextInterval = null;
    items = [];

    constructor(ctx, itemImages, scaleRatio, speed) {
        this.ctx = ctx;
        this.canvas = ctx.canvas;
        this.itemImages = itemImages;
        this.scaleRatio = scaleRatio;
        this.speed = speed;

        this.setNextItemTime();
    }

    setNextItemTime() { // 아이템을 0 ~ 10초 사이마다 생성
        this.nextInterval = this.getRandomNumber(
            this.INTERVAL_MIN,
            this.INTERVAL_MAX
        );
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    createItem() {
        // 아이템이 만들어질 때, 현재 스테이지ID가 몇인지 알 수 있다.
        // 현재 스테이지ID를 바탕으로 아이템을 생성한다.(0 ~ 현재 스테이지 사이에서 생성) 
        let item_index = 0;
        Item_Unlock.data.map((item, index) => {
            if (item.stage_id === this.currentStage) {
                item_index = this.getRandomNumber(0, index);
            }
        });

        const itemInfo = this.itemImages[item_index];
        const x = this.canvas.width * 1.5;
        const y = this.getRandomNumber(
            10,
            this.canvas.height - itemInfo.height
        );

        const item = new Item(
            this.ctx,
            itemInfo.id,
            x,
            y,
            itemInfo.width,
            itemInfo.height,
            itemInfo.image,
            itemInfo.score
        );

        this.items.push(item);
    }


    update(gameSpeed, deltaTime) {
        if (this.nextInterval <= 0) {
            if(this.currentStage !== 1000)
                this.createItem();
            this.setNextItemTime();
        }

        this.nextInterval -= deltaTime;

        this.items.forEach((item) => {
            item.update(this.speed, gameSpeed, deltaTime, this.scaleRatio);
        })

        this.items = this.items.filter(item => item.x > -item.width);
    }

    draw() {
        this.items.forEach((item) => item.draw());
    }

    collideWith(sprite) {
        const collidedItem = this.items.find(item => item.collideWith(sprite))
        if (collidedItem) {
            this.ctx.clearRect(collidedItem.x, collidedItem.y, collidedItem.width, collidedItem.height)
            return {
                itemId: collidedItem.id
            }
        }
    }

    getItemScore(itemId) {  // 아이템에 따라 점수 반환
        const score = this.items.find(() => itemId).score;
        return score;
    }

    setCurrentStage(currentStage) {
        this.currentStage = currentStage;
    }

    reset() {
        this.items = [];
    }
}

export default ItemController;