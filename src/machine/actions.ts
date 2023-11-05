import { currentPlayer, winingPositions } from './../utils/game';
import { GameContext, PlayerColor} from './../types';
//Action take an event and update the context and send it back

import { GameAction } from "../types";
import { freePositionY } from '../utils/game';
import { GameModel } from './GameMachine';

//This function change the player list
export const joinGameAction: GameAction<"join"> = (context, event) => ({
    players: [...context.players, {id: event.playerId, name:event.name}]
})

export const chooseColorAction:GameAction<"chooseColor"> = (context, event) => ({
    //Use imbricated map to avoid mutation
   players:context.players.map(player => {
    if(player.id === event.playerId){
        return {...player, color:event.color}
    }
    return player
   })
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

export const saveWinningPositionAction: GameAction<"dropToken"> = (context: GameContext, event) => ({
    winingPositions: winingPositions(
        context.grid,
        currentPlayer(context).color!,
        event.x,
        context.rowLength
    )
})

export const restartAction:GameAction<"restart"> = () => ({
    winingPositions: [],
    grid:GameModel.initialContext.grid,
    currentPlayer: null
})

//initialise the current player at the begin of the game
//Player using the yellow color will always start the party
export const setCurrentPlayerAction: GameAction<"start"> = (context:GameContext) => ({
    currentPlayer: context.players.find(player => player.color === PlayerColor.YELLOW)!.id
})