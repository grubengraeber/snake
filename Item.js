import {effectScore, 
    effectDamage,  
    effectDead, 
    effectSlowSpeed, 
    effectMediumSpeed, 
    effectFastSpeed,
    effectGrowSnake,
    effectShrinkSnake} from "./effects.js"; 

export class Item {
    static count = 0;
    static itemList = [];
    static possibleItems = [{"itemClass": "apple", "lifeSpan": 5, "collisionEffect": effectGrowSnake},
                            {"itemClass": "death", "lifeSpan": 10, "collisionEffect": effectDead},
                            {"itemClass": "speed-up", "lifeSpan": 10, "collisionEffect": effectFastSpeed},
                            {"itemClass": "speed-down", "lifeSpan": 10, "collisionEffect": effectSlowSpeed},
                            {"itemClass": "lower-health", "lifeSpan": 10, "collisionEffect": effectSlowSpeed},
                            {"itemClass": "score", "lifeSpan": 10, "collisionEffect": effectShrinkSnake}];
    
    static sanitize(time) {
        for (let index = 0; index < this.itemList.length; index++) {
            if (this.itemList[index].lifeEnd >= time) {
                let itemToClear = this.itemList[index];
                itemToClear.delete();
                console.dir(itemToClear);
                this.itemList.splice(index, 1);
            }
        }
    }
    //take the head of the snake, searches for matching item and returns the collide function
    static getItemOnFieldCollisionEffect(field) {
        const item = this.itemList.find(item => item.field == field);
        console.log(item);
        console.log(item.collisionEffect)
        return item.collisionEffect;
    }
    
    static generate(snake) {
        const randomItemBluePrint = this.possibleItems[Math.floor(Math.random() * this.possibleItems.length)]
        const generatedItem = new Item(randomItemBluePrint.itemClass,
                                        randomItemBluePrint.lifeSpan, 
                                        snake.lifeSpan,
                                        randomItemBluePrint.collisionEffect)
    }

    constructor(itemClass, lifeSpan, timeInSeconds, collisionEffect = null) {
        this.lifeStart = timeInSeconds;
        this.lifeEnd = timeInSeconds - lifeSpan;
        this.itemClass = itemClass;
        this.collisionEffect = collisionEffect;
        this.field = this.placeMe();
        this.initItemClass();
        Item.count++;
        Item.itemList.push(this);
    }
    placeMe() {
        let randomEmptyField = null;
        if (this.x == null || this.y == null) {
            const emptyFields = document.querySelectorAll(".field");
            const countOfEmptyFields = emptyFields.length;
            randomEmptyField = emptyFields[Math.floor(Math.random() * countOfEmptyFields)]
        }
        return randomEmptyField
    }
    initItemClass() {
        this.field.classList.add("item", this.itemClass);
        this.field.dataset.item = this;
    }
    onCollision() {
        console.log("onCOllision" + this.collisionEffect);
        return this.collisionEffect;
    }
    delete() {
        this.field.className = "field";
        this.field.dataset.item = null;
    }

    

}