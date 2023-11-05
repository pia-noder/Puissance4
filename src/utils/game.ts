import { GameContext, GridState, Player, PlayerColor } from "../types";

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
    //save a array that contain all the possible directions that we gonna test
    const directions = [
        [1,0],
        [0,1],
        [1,1],
        [1,-1]
    ]

    const currentTokenPosition = {
        y: freePositionY(grid,x),
        x:x
    }

    for(const direction of directions){
        //memorize all token with good color
        const items = [currentTokenPosition]
        for(const forward of [1,-1]){
        for(let i = 1; i < size; i++){
            const y = currentTokenPosition.y + (i * direction[0] * forward)
            const x = currentTokenPosition.x + (i * direction[1] * forward)
            
            if(grid?.[y]?.[x] !== color){
                break
            }
            items.push({x,y})
        }
    }
        if(items.length >= size){
            return items
        }
    }
    return []
}

export const currentPlayer = (context:GameContext): Player => {
    const player = context.players.find(player => player.id=== context.currentPlayer)
    if(player === undefined){
        throw new Error("Impossible de recupérere le joueur")
    }
    return player
}

export const countEmptyCells = (grid: GridState): number => {
    let count = 0
    for(const row of grid){
        for (const cell of row){
            if (cell === "E"){
                count++
            }
        }
    }
    return count
} 