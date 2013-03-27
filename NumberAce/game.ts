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
import stunts = module("stunts");

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
        this.queue.loadFile({ id: "piston", src: "./graphics/piston.png" });
        this.queue.loadFile({ id: "upArrow", src: "./graphics/upArrow.png" });
        this.queue.loadFile({ id: "downArrow", src: "./graphics/downArrow.png" });
        this.queue.loadFile({ id: "goButton", src: "./graphics/goButton.png" });
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
        stunts.Stunt.board = this.board;
        this.stage.addChild(this.board);

        Game.controls = new control.Controls(control.Controls.touch);

        this.player = new control.Player(this.queue);
        this.player.column = 0;
        this.player.power = 0;
        this.player.height = this.board.getLine(0).size();

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
        var nextLine = this.board.getLine(this.player.column + 1);

        var stunt: stunts.Stunt = new stunts.AddPlatform(line, nextLine, this.player,
            () => {
                 this.success();
             },
            () => {
                this.failure();
            });

        stunt.go();
        this.player.power = 0;
    }

    private success() {
        this.player.height = this.board.getLine(this.player.column).size();
        this.player.column++;
        this.player.combo += 10;
    }

    private failure() {
        this.player.ready = true;
        this.player.combo = 0;
    }

    update() {
        if (this.player.progress > Game.width / 2) {
            this.cameraOffset = this.player.progress - (Game.width / 2);
        }
        else {
            this.cameraOffset = 0;
        }

        this.player.ball.x = this.player.progress - this.cameraOffset;
        this.player.ball.y = this.board.getLine(this.player.column).y;

        this.board.x = -this.cameraOffset;

        Game.ui.update(this.player);

        this.stage.update();
    }
}

require([], () => {
    var el = <HTMLCanvasElement> document.getElementById('game');
    el.width = window.innerWidth;
    el.height = window.innerHeight;
    var game = new Game(el);
});