import board = module("board");
import game = module("game");

export class Stunt {
    constructor(public from: board.Line, public to: board.Line, public callback: Function) {
        
    }

    go() {
        if (this.callback) {
            this.callback();
        }
    }

    public static register(stunt: Stunt) {
    }
}

export class MovePlatform extends Stunt {
    go() {
        
    }
}