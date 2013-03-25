import board = module("board");
import game = module("game");

export class Stunt {
    constructor(private from: board.Line, private to: board.Line, private callback: Function) {
        
    }

    public static register(stunt: Stunt) {
    }
}

export class MovePlatform extends Stunt {
}