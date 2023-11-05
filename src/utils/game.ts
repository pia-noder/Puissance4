import { GridState, PlayerColor } from "../types";

export const freePositionY = (grid: GridState, x: number): number => {
    for(let y = grid.length -1; y >=0; y--){
        if(grid[y][x] === 'E'){
            return y
        }
    }
    return -1
}

//Found where the droped token is and go in every direction to check if 4 token of same color are align
//(by memorizing the number of token with the same color)
//size param is used to define the number of token that need to be align to win the game
export const winingPositions = (grid: GridState, color: PlayerColor, x:number, size:number) => {
    //save a array that contain all the direction that we gonna test
    const directions = [
        [1,0],
        [0,1],
        [1,1],
        [1,-1]
    ]

    const tokenPosition = {
        y: freePositionY(grid,x),
        x:x
    }
    for(const direction of directions){
        //memorize all token with good color
        const items = [tokenPosition]
        for(let i = 1; i<size; i++){
            const x = tokenPosition.x + (i+ direction[1])
            const y = tokenPosition.y + (i+ direction[1])
            if(grid[y][x] !== color){
                break
            }
            items.push({x,y})
        }
    }
}