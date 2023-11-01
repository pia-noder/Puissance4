import { GameMachine, GameModel } from './../../src/machine/GameMachine';
import {beforeEach, describe, it, expect} from 'vitest'
import { InterpreterFrom, interpret } from 'xstate'

describe("machine/guards", () => {

    describe("canJoinGame", () => {
        let machine: InterpreterFrom<typeof GameMachine>

        //reinitializ the machine before each test
        beforeEach(() => {
            machine = interpret(GameMachine).start()
        })

        it("should let a player join", () => {
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true)
        })
        it("should not let a player join twice", () => {
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(true)
            expect(machine.send(GameModel.events.join("1","1")).changed).toBe(false)
        })
    })
})