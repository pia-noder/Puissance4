import { ContextFrom, EventFrom } from "xstate"
import { GameModel } from "./machine/GameMachine"

export enum PlayerColor {
    RED = 'R',
    YELLOW = 'Y'
}
export enum GameStates  {
    LOBBY = 'LOBBY', //player are waiting
    PLAY = 'PLAY',
    VICTORY = 'VICTORY',
    DRAW = 'DRAW',
}

export type Player = {
    id: string,
    name: string,
    color?: PlayerColor
}

export type CellEmpty = 'E'
export type CellState = "R" | "Y"|PlayerColor.YELLOW | PlayerColor.RED | CellEmpty
export type GridState = CellState[][]
export type GameContext = ContextFrom<typeof GameModel>
export type GameEvents = EventFrom<typeof GameModel>
export type GameEvent<T extends GameEvents["type"]> = GameEvents & {type: T}
export type GameGuard<T extends GameEvents["type"]> = (
    context: GameContext,
    event: GameEvent<T>
) => boolean
export type GameAction<T extends GameEvents["type"]> = (
    context: GameContext,
    event: GameEvent<T>
) => Partial<GameContext>