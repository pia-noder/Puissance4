import { GameMachine, GameModel, makeGame } from './../../src/machine/GameMachine';
import {beforeEach, describe, it, expect} from 'vitest'
import { InterpreterFrom, interpret } from 'xstate'
import { GameContext, GameStates, PlayerColor } from '../../src/types';
import { canDropGuard } from '../../src/machine/guards';

describe("machine/GameMachine", () => {

    describe("join", () => {
        let machine: InterpreterFrom<typeof GameMachine>

        //reinitializ the machine before each test
        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it("should let a player join", () => {
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true)
            expect(machine.getSnapshot().context.players).toHaveLength(1)

            expect(machine.send(GameModel.events.join("2","2")).changed).toBe(true)
            expect(machine.getSnapshot().context.players).toHaveLength(2)
        })
        it("should not let a player join twice", () => {
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true)
            expect(machine.getSnapshot().context.players).toHaveLength(1)
            
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(false)
            expect(machine.getSnapshot().context.players).toHaveLength(1)
        })
    })

    describe("dropToken", () => {
        const machine = makeGame(GameStates.PLAY,{
           players:[{
                id:'1',
                name:'1',
                color:PlayerColor.RED
            },{
                id:'2',
                name:'2',
                color:PlayerColor.YELLOW
            }],
            currentPlayer: '1',
            grid:[
                ["E","E","E","E","E","E","R"],
                ["E","E","E","E","E","R","Y"],
                ["E","E","E","E","E","R","R"],
                ["E","E","E","E","E","R","R"],
                ["E","E","E","E","E","Y","Y"],
                ["E","E","E","E","E","Y","R"],
            ] 
        })



        it("should let me drop a function",() => {
            expect(machine.send(GameModel.events.dropToken("1",0)).changed).toBe(true)
            expect(machine.state.context.grid[5][0]).toBe(PlayerColor.RED)

        })
    })
})