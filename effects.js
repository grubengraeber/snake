//import {snake} from "./game.js"


export const effectScore =  function (snake) {
    snake.score+= 500;
}


export const effectDamage = function(snake) {
    snake.health-= 500;
}


export const effectDead =  function(snake) {
    snake.health = 0;
}

export const effectSlowSpeed = function (snake) {
    snake.speed = 250;
}

export const effectMediumSpeed = function(snake) {
    snake.speed = 100;
}

export const effectFastSpeed = function(snake) {
    snake.speed = 10;
}

export const effectGrowSnake = function(snake) {
    snake.length += 5;
}

export const effectShrinkSnake = function(snake) {
    if (snake.length - 5 <= 4) {
        snake.length -= 5;
    }
}


