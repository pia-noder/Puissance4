import { ContextFrom, EventFrom } from "xstate"
import { GameModel } from "./machine/GameMachine"

export enum PlayerColor {
    RED = 'red',
    YELLOW = 'yellow'
}
export type Player = {
    id: string,
    name: string,
    color?: PlayerColor
}

export type CellEmpty = 'E'
export type CellState = PlayerColor.YELLOW | PlayerColor.RED | CellEmpty
export type GridState = CellState[][]
export type GameContext = ContextFrom<typeof GameModel>
export type GameEvent = EventFrom<typeof GameModel>