export class SnakeElement {

    constructor(x, y, vector, getFieldByCoordinate) {
        this.x = x;
        this.y = y;
        this.vector = vector;
        this.field = getFieldByCoordinate(x,y);
    }
    
}



