import { GameContext} from './../types';
//Action take an event and update the context and send it back

import { GameAction } from "../types";
import { freePositionY } from '../utils/game';

//This function change the player list
export const joinGameAction: GameAction<"join"> = (context, event) => ({
    players: [...context.players, {id: event.playerId, name:event.name}]
})

export const leaveGameAction: GameAction<"leave"> = (context, event) => ({
    players: context.players.filter(player => player.id != event.playerId)
})

export const dropTokenAction: GameAction<"dropToken"> = ({grid, players}, {x:eventX, playerId}) => {
    const playerColor = players.find(player => playerId === player.id)!.color!
    const eventY = freePositionY(grid, eventX)
    const newGrid = grid.map((row,y ) => row.map((v,x)=> x === eventX && y === eventY ? playerColor : v) )
    return {
        grid:newGrid
    }
}

export const switchPlayerAction = (context: GameContext) => ({
    currentPlayer: context.players.find(player => player.id !== context.currentPlayer)?.id
})

export const chooseColorAction: GameAction<"chooseColor"> = (context, event) => ({
    players: context.players.find(player => player.id === event.playerId)
})