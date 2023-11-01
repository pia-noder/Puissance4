import { PlayerColor } from './../types';
//Action take an event and update the context and send it back

import { GameAction } from "../types";

//This function change the player list
export const joinGameAction: GameAction<"join"> = (context, event) => ({
    players: [...context.players, {id: event.playerId, name:event.name}]
})

export const leaveGameAction: GameAction<"join"> = (context, event) => ({
    players: context.players.filter(player => player.id != event.playerId)
})

/* export const dropTokenAction: GameAction<"dropToken"> = ({grid, players}, {x, playerId}) => ({
    const PlayerColor = players.find(player => playerId === player.id).color!
    const y = 
}) */