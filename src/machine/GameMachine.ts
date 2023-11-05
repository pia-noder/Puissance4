import { createModel } from "xstate/lib/model";
import { GameContext, GameStates, GridState, Player, Position } from "../types";
import { canChooseColorGuard, canDropTokenGuard, canJoinGuard, canLeaveGuard, canStartGameGuard, isDrawMoveGuard, isWinningMoveGuard } from "./guards";
import { chooseColorAction, dropTokenAction, joinGameAction, leaveGameAction, restartAction, saveWinningPositionAction, setCurrentPlayerAction, switchPlayerAction } from "./actions";
import { InterpreterFrom, interpret } from "xstate";

export const GameModel = createModel({
    players:[] as Player[],
    currentPlayer: null as null | Player['id'],
    rowLength:4,
    winingPositions:[] as Position[],
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
                    target: GameStates.LOBBY,
                    actions:[GameModel.assign(chooseColorAction)]
                },
                //start a game
                start: {
                    cond:canStartGameGuard,
                    target: GameStates.PLAY,
                    actions:[GameModel.assign(setCurrentPlayerAction)]
                }
            }
        },
        [GameStates.PLAY]:{
            after:{
                20000:{
                    target:GameStates.PLAY,
                    actions:[GameModel.assign(switchPlayerAction)]
                }
            },
            on:{
                dropToken:[
                    {
                        cond: isDrawMoveGuard,
                        target:GameStates.DRAW,
                        actions:[GameModel.assign(dropTokenAction) ]
                    },
                    {
                        cond: isWinningMoveGuard,
                        target:GameStates.VICTORY,
                        actions:[GameModel.assign(saveWinningPositionAction),GameModel.assign(dropTokenAction) ]
                    },
                    {
                    cond: canDropTokenGuard,
                    target: GameStates.PLAY,
                    actions:[GameModel.assign(dropTokenAction), GameModel.assign(switchPlayerAction)],
                }]
            },
        },
        [GameStates.VICTORY]:{
            on:{
                restart:{
                    target: GameStates.LOBBY,
                    actions:[GameModel.assign(restartAction)]
                }
            },
        },
        [GameStates.DRAW]:{
            on:{
                restart:{
                    target: GameStates.LOBBY,
                    actions:[GameModel.assign(restartAction)]
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