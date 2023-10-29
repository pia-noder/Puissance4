import { createMachine } from "xstate";
import { createModel } from "xstate/lib/model";
import { GridState, Player } from "../types";

enum GameStates  {
    LOBBY = 'LOBBY', //player are waiting
    PLAY = 'PLAY',
    VICTORY = 'VICTORY',
    DRAW = 'DRAW',
}

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
        join: (playerId: Player["id"], name: Player["name"]) => ({playerId, name})
    }
})
export const GameMachine = createMachine({
    id:'game',
    initial: GameStates.LOBBY,
    states:{
        [GameStates.LOBBY]:{
            on:{
                //join a game
                join:{
                    target: GameStates.LOBBY
                },
                //leave a party
                leave:{
                    target: GameStates.LOBBY
                },
                //choose a color
                chooseColor:{
                    target: GameStates.LOBBY
                },
                //start a game
                start: {
                    target: GameStates.PLAY
                }
            }
        },
        [GameStates.PLAY]:{
            on:{
                dropToken:{
                    //target: '????'
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