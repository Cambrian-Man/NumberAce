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
    private background: createjs.DisplayObject;

    public static controls: control.Controls;
    public static ui: ui.UI;

    public static blockSize;
    public static height;
    public static width;

    private cameraOffset = 0;

    private drainTimer: number;

    constructor(canvas: HTMLCanvasElement) {
        this.stage = new createjs.Stage(canvas);
        Game.height = canvas.height;
        Game.width = canvas.width;
        Game.blockSize = Math.floor(Game.height / 15);

        this.queue = new createjs.LoadQueue();
        this.queue.loadFile({ id: "ball", src: "./graphics/ball.png" });
        this.queue.loadFile({ id: "block", src: "./graphics/block.png" });
        this.queue.loadFile({ id: "piston", src: "./graphics/piston.png" });
        this.queue.loadFile({ id: "background", src: "./graphics/background.png" });
        this.queue.loadFile({ id: "platform", src: "./graphics/platform.png" });
        this.queue.loadFile({ id: "upArrow", src: "./graphics/upArrow.png" });
        this.queue.loadFile({ id: "downArrow", src: "./graphics/downArrow.png" });
        this.queue.loadFile({ id: "raisePlatform", src: "./graphics/raisePlatform.png" });
        this.queue.loadFile({ id: "lowerPlatform", src: "./graphics/lowerPlatform.png" });
        this.queue.loadFile({ id: "goButton", src: "./graphics/goButton.png" });
        this.queue.loadFile({ id: "comboMeter", src: "./graphics/comboMeter.png" });
        this.queue.addEventListener("complete", () => { this.gameSetup() });

        stunts.Stunt.queue = this.queue;
    }

    gameSetup() {
        this.stage.removeAllChildren();

        createjs.Ticker.addEventListener("tick", () => { this.update(); });

        Game.ui = new ui.UI(ui.UI.tablet, this.queue);
        ui.StuntCarousel.loadIcons(this.queue);

        Game.controls = new control.Controls(control.Controls.touch);

        // Build the background.
        var backBitmap = <HTMLImageElement> this.queue.getResult("background");
        this.background = new createjs.Container();
        var compWidth = (Game.height / backBitmap.height) * backBitmap.width;
        for (var i = 0; i < Game.width / compWidth); i++) {
            var backComponent = new createjs.Bitmap(backBitmap);
            backComponent.scaleY = Game.height / backBitmap.height;
            backComponent.scaleX = Game.height / backBitmap.height;
            backComponent.x = compWidth * i;
            (<createjs.Container> this.background).addChild(backComponent);
        }
        this.stage.addChild(this.background);

        this.gameStart();
    }

    gameStart() {
        this.board = new board.Board(this.queue);
        stunts.Stunt.board = this.board;
        this.stage.addChild(this.board);

        this.player = new control.Player(this.queue);
        this.player.column = 0;
        this.player.power = 0;
        this.player.height = this.board.getLine(0).size();
        Game.ui.carousel.buildIcons(this.player);

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
        clearInterval(this.drainTimer);
        this.drainTimer = null;

        var line = this.board.getLine(this.player.column);
        var nextLine = this.board.getLine(this.player.column + 1);

        var stunt: stunts.Stunt = new this.player.stunts[this.player.currentStunt](line, nextLine, this.player,
            () => {
                 this.success();
             },
            () => {
                this.failure();
            });

        if (this.player.mode == control.Player.subtractMode && line.size() - this.player.power <= 0) {
            this.failure();
        }
        else {
            stunt.go();
        }
        this.player.power = 0;
    }

    private drainCombo() {
        if (this.player.combo > 0) {
            this.player.combo -= 1;
        }
    }

    private success() {
        this.player.height = this.board.getLine(this.player.column).size();
        this.player.column++;

        if (this.player.column == this.board.size()) {
            this.showEnding();
            return;
        }

        if (this.player.combo < 100) {
            this.player.combo += 10;
        }
        else {
            this.player.combo = 100;
        }
        this.player.score += (10 + this.player.combo);
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

        if (this.player.ready && !this.drainTimer) {
            this.drainTimer = setInterval(() => {
                this.drainCombo();
            }, 1000);
        }

        this.stage.update();
    }

    showEnding() {
        var endText: createjs.Text = new createjs.Text("Your Score is " + this.player.score, Game.width / 30 + "px Fredoka One", "#FFF");
        endText.x = Game.width / 2;
        endText.y = Game.height / 2;
        endText.textAlign = "center";
        this.stage.addChild(endText);

        this.player.ready = false;
        this.stage.update();

        var goOn = () => {
            this.gameSetup();
            window.removeEventListener("click", goOn);
        }

        window.addEventListener("click", goOn);

        createjs.Ticker.removeAllListeners();
    }
}

require([], () => {
    var el = <HTMLCanvasElement> document.getElementById('game');
    el.width = window.innerWidth;
    el.height = window.innerHeight;
    var game = new Game(el);
});