import { SnakeElement } from "./snakeElement.js";
import { Item } from "./Item.js";
import { collisionManagement, cutSnake, getIndexOfBittenSnakePart } from "./collisionManagement.js";

//Unit is pxl



function getFieldByCoordinate(xCoord, yCoord) {
    const fields = document.querySelectorAll(".field");
    for (let field of fields) {
        if (field.dataset.xCoord == xCoord && field.dataset.yCoord == yCoord) {
            return field;
        }
    }
}

//TODO move to config 
const boardWidth = 500;
const boardHeight = 500;
const fieldSize = 100;
const fieldHeight = 10;
const fieldWidth = 10;
const numberOfFields = (boardWidth * boardHeight) / fieldSize;
const startingX = 10;
const startingY = 10;
const startingVector = 0;
const startingSpeed = 50; //in ms time
const speedIntervalls = 10;
const timeField = document.getElementById("time");
let interval = null;
const timeToRun = 120
const startingHealth = timeToRun * 1000;
const maxSpeed = 5;
const minSpeed = 1000;
const healthBar = document.querySelectorAll("#health")[0];
const time = document.querySelectorAll("#time")[0];
const score = document.querySelectorAll("#score")[0];

//score settings
const scorePerTick = 50; 
const scorePerHealth = 10 


//snake object
export let snake = { 
    "x": startingX, 
    "y": startingY, 
    "length": 4,
    "vector": startingVector,
    "speed": startingSpeed,
    "health": startingHealth,
    "tailX": startingX,
    "tailY": startingY,
    "field": null,
    "track": [1,2,3,4], //max len der schlange 
    "fieldToClean": null,
    "lifeSpan": timeToRun,
    "score": 0,
    move: function() {
            switch (this.vector) {
                case 0:
                    if (this.x === (boardWidth/fieldWidth) - 1) {
                        this.x = 0;
                    } else {
                        this.x += 1;
                    }
                    break;
                case 90:
                    if (this.y === 0) {
                        this.y = (boardHeight / fieldHeight) - 1;
                    } else {
                        this.y -= 1;
                    }
                    break;
                case 180:
                    if (this.x === 0) {
                        this.x = (boardWidth / fieldWidth) - 1;
                    } else {
                        this.x -= 1;
                    }
                    break;
                case 270:
                    if (this.y === (boardHeight/fieldHeight) - 1) {
                        this.y = 0;
                    } else {
                        this.y += 1;
                    }
            }
            const newSnakeElement = new SnakeElement(this.x, this.y, this.vector, getFieldByCoordinate);
            this.addElemtToTrack(newSnakeElement);
            this.lifeSpan = Math.floor(this.health/1000);
        },
    setField: function() {
            this.field = getFieldByCoordinate(this.x, this.y)
        },
    addElemtToTrack: function(newElement){
        const newArrayLength = this.track.unshift(newElement);
        if (newArrayLength >= this.length) {
           this.fieldToClean = this.track.pop();
        }
    },
    calcScore: function() {
        snake.score += snake.length;
    }


};

//start the game
const startButton = document.querySelectorAll(".btn-start")[0];
startButton.addEventListener("click", () => {setGameSpeed();});
initGame();
drawSnakeOnField(snake);
//setGameSpeed();






//calls the play function in intervalls, the intervall value = the speed of the snake
function setGameSpeed() {
    interval = setInterval(() => { play(); }, snake.speed);
    //setIntervall move snake .then collision check
}


//game logic - first move the snake, then draw the snake, clear/reset interval timer
function play() {
    snake.move();
    //console.log("COLLISION MANAGEMENT Body: ", collisionManagement("snake", snake));
    if (collisionManagement("snake", snake)) {
        let cutIndex = getIndexOfBittenSnakePart(snake);
        cutSnake(snake, cutIndex);
    }
    else if (collisionManagement("item", snake)) {
        const collisionEffect = Item.getItemOnFieldCollisionEffect(snake.track[0].field)
        collisionEffect(snake);
    }
    drawSnakeOnField(snake);
    clearInterval(interval);
    if (snake.health > 0) {
        snakeHealthHandler(snake);
        setGameSpeed();
        Item.sanitize(snake.lifeSpan);
    }
    snake.calcScore();    
    drawUi();
    const speed = document.querySelectorAll("#speed")[0];
    speed.textContent = "speed = " + snake.speed;
}

function drawUi() {
    time.textContent = "seconds remaining = " + Math.floor(snake.health/1000) + "snake " + snake.lifeSpan;    
    healthBar.innerHTML = "health = " + snake.health + " + snake.health";
    score.textContent = "Score = " + snake.score
}


function snakeHealthHandler(snake) {
    snake.health -= snake.speed
}

//TODO WORK HEALTH!!! LOSS WIN !!!

function initGame() {
    
    //first time inite gameSpeed for starting the movement and setting up the intervall timer
    const startHead = new SnakeElement(10, 10, 0, getFieldByCoordinate);
    const startBody = new SnakeElement(9, 10, 0, getFieldByCoordinate);
    const startTail = new SnakeElement(8, 10, 0, getFieldByCoordinate);
    const cleanUpField = new SnakeElement(7, 10, 0, getFieldByCoordinate);
    snake.track = [startHead, startBody, startTail, cleanUpField]
    
    const boardContainer = document.querySelectorAll(".board-container")[0];
    let xCoord = 0;
    let yCoord = 0;
    const pointOfNewRow = (boardWidth / fieldWidth);
    // Your game can start here, but define separate functions, don't write everything in here :)
    for (let i = 0; i < numberOfFields; i++) {
        const field = document.createElement("div");
        initField(field, i, xCoord, yCoord);
        boardContainer.appendChild(field);
        
        if (i === 0) {
            xCoord ++;
        }
        else if ( (i+1) % pointOfNewRow == 0) {
            xCoord = 0;
            yCoord += 1;
        }
        else {
            xCoord = xCoord + 1;
        }
    }
    initEventlisteners();    
    
}

function initField(field, fieldNumber, xCoord, yCoord) {
    field.classList.add("field");
    field.id = "field" + fieldNumber;
    field.dataset.xCoord = xCoord;
    field.dataset.yCoord = yCoord;
    field.dataset.item = null;
}

function initEventlisteners() {
    document.addEventListener("keypress", e => { keyPressHandler(e); });
}



function keyPressHandler(e) {
    switch(e.key) {
        case "w": 
            snake.vector = snake.vector !== 270 ? 90 : 270;
            break;
        case "s":
            snake.vector = snake.vector !== 90 ? 270 : 90;
            break;
        case "d":
            snake.vector = snake.vector !== 180 ? 0 : 180;
            break;
        case "a":
            snake.vector = snake.vector !== 0 ? 180 : 0;
            break;
        case "o":
            if (snake.speed >= maxSpeed) {    
                snake.speed -= speedIntervalls;
            }
            break;
        case "l":
            if (snake.speed <= minSpeed) {
                snake.speed += speedIntervalls;
            };
            break;
        case "+":
            snake.track.unshift(new SnakeElement(snake.x, snake.y, snake.vector, getFieldByCoordinate))
            snake.length++;
            break;
        case "i":
            Item.generate(snake);
            break;
        }
       


    // watch for special key presses here and coordinate movement
}

function drawSnakeOnField(snake) {
    for (let index = 0; index < snake.track.length; index++) {
        switch(index) {
            case 0:
                setHeadDrawingClasses(snake.track[index].field);
                continue;
            //the next before last is tale
            case snake.track.length-2:
                setTailDrawingClasses(snake.track[index].field);
                continue;
                //every snake has a clean up element / last element to draw a field again
            case snake.track.length-1:
                setNoSnakeFieldClasses(snake.track[index].field);
                continue;
            default:
                setBodyDrawingClasses(snake.track[index].field);
        }
    }
}

function setHeadDrawingClasses(field) {
    field.classList.add("snake", "head");
    //field.className = "field snake head";
}

function setBodyDrawingClasses(field) {
    //field.classList.remove("head")
    field.className = "field snake body"
}

function setTailDrawingClasses(field) {
    //field.classList.add("tail");
    field.className = "field snake tail"
}

function setNoSnakeFieldClasses(field) {
    field.className = "field";
}





