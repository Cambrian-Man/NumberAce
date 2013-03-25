/// <reference path="./ts-definitions/DefinitelyTyped/easeljs/easeljs.d.ts" />
/// <reference path="./ts-definitions/DefinitelyTyped/preloadjs/preloadjs.d.ts" />
/// <reference path="./ts-definitions/DefinitelyTyped/tweenjs/TweenJS.d.ts" />
/// <reference path="./ts-definitions/DefinitelyTyped/requirejs/requirejs.d.ts" />
/// <reference path="./board.ts" />
/// <reference path="./control.ts" />
/// <reference path="./ui.ts" />

import board = module("board");
import control = module("control");
import ui = module("ui");

export class Game {
    public stage: createjs.Stage;
    private queue: createjs.LoadQueue;

    public player: control.Player;
    public board: board.Board;
    private background: createjs.Shape;

    public static controls: control.Controls;
    public static ui: ui.UI;

    public static blockSize;
    public static height;
    public static width;

    private cameraOffset = 0;

    constructor(canvas: HTMLCanvasElement) {
        this.stage = new createjs.Stage(canvas);
        Game.height = canvas.height;
        Game.width = canvas.width;
        Game.blockSize = Math.floor(Game.height / 15);

        this.queue = new createjs.LoadQueue();
        this.queue.loadFile({ id: "ball", src: "./graphics/ball.png" });
        this.queue.loadFile({ id: "block", src: "./graphics/block.png" });
        this.queue.addEventListener("complete", () => { this.gameStart() });
    }

    gameStart() {
        createjs.Ticker.addEventListener("tick", () => { this.update(); });

        Game.ui = new ui.UI(ui.UI.tablet, this.queue);

        var g = new createjs.Graphics();
        g.beginLinearGradientFill(["#115ca4", "#5ecaed"], [0, 1], 0, 0, 0, Game.height);
        g.drawRect(0, 0, Game.width, Game.height);
        this.background = new createjs.Shape(g);
        this.stage.addChild(this.background);

        this.board = new board.Board(this.queue);
        this.stage.addChild(this.board);

        Game.controls = new control.Controls(control.Controls.touch);

        this.player = new control.Player(this.queue);
        this.player.column = 0;
        this.player.power = 0;
        this.player.height = this.board.getLine(0).size();
        this.setPlayerPosition();

        this.player.onActivate = () => {
            if (this.player.ready) {
                this.activate();
            }
        }
        this.stage.addChild(this.player.ball);

        
        this.stage.addChild(Game.ui);
    }

    activate() {
        if (!this.player.ready) { return; }

        this.player.ready = false;

        var line = this.board.getLine(this.player.column);

        var blocksCompleted = () => {
            if (line.size() == this.board.getLine(this.player.column + 1).size()) {
                this.success();
            }
            else {
                this.failure();
            }
        }

        if (this.player.mode == control.Player.subtractMode) {
            if (line.size() > 0 || this.player.power == 0) {
                line.removeBlocks(this.player.power, true, () => {
                    blocksCompleted();
                });
            }
        }
        else if (this.player.mode == control.Player.addMode) {
            if (line.size() < 10 || this.player.power == 0) {
                line.addBlocks(this.player.power, true, () => {
                    blocksCompleted();
                });
            }
        }

        this.player.power = 0;
    }

    private success() {
        this.player.height = this.board.getLine(this.player.column).size();
        this.setPlayerPosition();
        this.player.column++;
        this.animateProgress();
    }

    private failure() {
        this.player.ready = true;
    }

    private animateProgress() {
        var completed: Function = () => {
            this.player.ready = true;
        }
        
        var minOffsetColumn = Math.floor(Game.width / Game.blockSize) / 2;

        if (this.player.column > minOffsetColumn) {
            this.cameraOffset = (this.player.column - minOffsetColumn) * Game.blockSize;
        }
        else {
            this.cameraOffset = 0;
        }

        if (this.cameraOffset == 0) {
            // If we don't need to animate the camera, just move the player.
            createjs.Tween
                .get(this.player.ball)
                .to({ x: this.board.getLine(this.player.column).x }, 500, createjs.Ease.sineInOut)
                .call(<any> completed);
        }
        else {
            // Otherwise, we tween the board.
            createjs.Tween
                .get(this.board)
                .to({ x: -this.cameraOffset }, 500, createjs.Ease.sineInOut)
                .call(<any> completed);
        }
    }

    setPlayerPosition() {
        this.player.ball.x = this.board.getLine(this.player.column).x - this.cameraOffset;
        this.player.ball.y = this.board.getLine(this.player.column).y;
    }

    update() {
        if (!createjs.Tween.hasActiveTweens(this.player.ball)) {
            this.setPlayerPosition();
        }

        Game.ui.updatePower(this.player);

        this.stage.update();
    }
}

require([], () => {
    var el = <HTMLCanvasElement> document.getElementById('game');
    el.width = window.innerWidth;
    el.height = window.innerHeight;
    var game = new Game(el);
});