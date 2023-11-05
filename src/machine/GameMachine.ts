import { createModel } from "xstate/lib/model";
import { GameContext, GameStates, GridState, Player } from "../types";
import { canChooseColorGuard, canDropTokenGuard, canJoinGuard, canLeaveGuard, canStartGameGuard } from "./guards";
import { dropTokenAction, joinGameAction, leaveGameAction, switchPlayerAction } from "./actions";
import { InterpreterFrom, interpret } from "xstate";

export const GameModel = createModel({
    players:[] as Player[],
    currentPlayer: null as null | Player['id'],
    rowLength:4,
    grid: [
        ["E","E","E","E","E","E","E"],
        ["E","E","E","E","E","E","E"],
        ["E","E","E","E","E","E","E"],
        ["E","E","E","E","E","E","E"],
        ["E","E","E","E","E","E","E"],
        ["E","E","E","E","E","E","E"],
    ] as GridState
},{
    events:{
        join: (playerId: Player["id"], name: Player["name"]) => ({playerId, name}),
        leave: (playerId: Player["id"]) => ({playerId}),
        chooseColor: (playerId: Player["id"], color: Player["color"]) => ({playerId, color}),
        start: (playerId:Player["id"]) => ({playerId}),
        dropToken: (playerId: Player["id"], x: number) => ({playerId, x}),
        restart: () =>({})
    }
})
//Use GameMachine from GameModel help to type authomatical the machine
export const GameMachine = GameModel.createMachine({
    id:'game',
    context:GameModel.initialContext,
    initial: GameStates.LOBBY,
    states:{
        [GameStates.LOBBY]:{
            on:{
                //join a game
                join:{
                    cond:canJoinGuard,
                    actions: [GameModel.assign(joinGameAction)],
                    target: GameStates.LOBBY
                },
                //leave a party
                leave:{
                    cond: canLeaveGuard,
                    actions:[GameModel.assign(leaveGameAction)],
                    target: GameStates.LOBBY
                },
                //choose a color
                chooseColor:{
                    cond:canChooseColorGuard,
                    target: GameStates.LOBBY
                },
                //start a game
                start: {
                    cond:canStartGameGuard,
                    target: GameStates.PLAY
                }
            }
        },
        [GameStates.PLAY]:{
            on:{
                dropToken:{
                    cond: canDropTokenGuard,
                    target: GameStates.PLAY,
                    actions:[GameModel.assign(dropTokenAction), GameModel.assign(switchPlayerAction)],
                }
            },
        },
        [GameStates.VICTORY]:{
            on:{
                restart:{
                    target: GameStates.LOBBY
                }
            },
        },
        [GameStates.DRAW]:{
            on:{
                restart:{
                    target: GameStates.LOBBY
                }
            },
        }
    }
})

//function to generate a Machine in a specific state
export const makeGame = (state:GameStates = GameStates.LOBBY, context: Partial<GameContext>= {}):InterpreterFrom<typeof GameMachine> =>{
    const machine = interpret(
        GameMachine.withContext({
            ...GameModel.initialContext,
            ...context
        })).start()
        //Modify the machine state à la volé
        machine.state.value = state
        return machine
}