import {GameGuard } from "../types";

export const canJoinGuard: GameGuard<"join"> = (context, event) => {
    return context.players.length < 2 && context.players.find(player => player.id != event.playerId) === undefined
}