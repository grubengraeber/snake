export function collisionManagement(className, snake) {
    const snakeHead = snake.track[0];
    //console.log(className)
    //console.log(snakeHead.field.classList)
    //console.log(snakeHead.field.dataset.item)
    return snakeHead.field.classList.contains(className);
}

export function getIndexOfBittenSnakePart(snake) {
    const snakeHead = snake.track[0];
    for (let index=1; index < snake.track.length; index++) {
        if (snakeHead.x === snake.track[index].x && snakeHead.y === snake.track[index].y) {
            return index;
        }
    }
}

export function cutSnake(snake, cutIndex) {
    let deletedSnakeParts = snake.track.slice(cutIndex);
    for (let index = 0; index < deletedSnakeParts.length; index++) {
        snake.track.pop()
        if (deletedSnakeParts[index].field.classList.contains("snake")) {
            deletedSnakeParts[index].field.classList.remove("snake");
        } //else if (deletedSnakeParts[index].field.classList.contains("tail")) {
        //     deletedSnakeParts[index].field.classList.remove("tail");
        // }
    }
    snake.length -= deletedSnakeParts.length;
}

export function growSnakeBy(growNumber, snake) {

}

export function  shrinkSnakeBy(shrinkNumber, snake) {

}