define(["require", "exports", "board", "control", "ui", "stunts"], function(require, exports, __board__, __control__, __ui__, __stunts__) {
    /// <reference path="./ts-definitions/DefinitelyTyped/easeljs/easeljs.d.ts" />
    /// <reference path="./ts-definitions/DefinitelyTyped/preloadjs/preloadjs.d.ts" />
    /// <reference path="./ts-definitions/DefinitelyTyped/tweenjs/TweenJS.d.ts" />
    /// <reference path="./ts-definitions/DefinitelyTyped/requirejs/requirejs.d.ts" />
    /// <reference path="./board.ts" />
    /// <reference path="./control.ts" />
    /// <reference path="./ui.ts" />
    var board = __board__;

    var control = __control__;

    var ui = __ui__;

    var stunts = __stunts__;

    var Game = (function () {
        function Game(canvas) {
            var _this = this;
            this.cameraOffset = 0;
            this.stage = new createjs.Stage(canvas);
            Game.height = canvas.height;
            Game.width = canvas.width;
            Game.blockSize = Math.floor(Game.height / 15);
            this.queue = new createjs.LoadQueue();
            this.queue.loadFile({
                id: "ball",
                src: "./graphics/ball.png"
            });
            this.queue.loadFile({
                id: "block",
                src: "./graphics/block.png"
            });
            this.queue.loadFile({
                id: "piston",
                src: "./graphics/piston.png"
            });
            this.queue.loadFile({
                id: "platform",
                src: "./graphics/platform.png"
            });
            this.queue.loadFile({
                id: "upArrow",
                src: "./graphics/upArrow.png"
            });
            this.queue.loadFile({
                id: "downArrow",
                src: "./graphics/downArrow.png"
            });
            this.queue.loadFile({
                id: "goButton",
                src: "./graphics/goButton.png"
            });
            this.queue.addEventListener("complete", function () {
                _this.gameStart();
            });
            stunts.Stunt.queue = this.queue;
        }
        Game.prototype.gameStart = function () {
            var _this = this;
            createjs.Ticker.addEventListener("tick", function () {
                _this.update();
            });
            Game.ui = new ui.UI(ui.UI.tablet, this.queue);
            var g = new createjs.Graphics();
            g.beginLinearGradientFill([
                "#115ca4", 
                "#5ecaed"
            ], [
                0, 
                1
            ], 0, 0, 0, Game.height);
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
            this.player.onActivate = function () {
                if(_this.player.ready) {
                    _this.activate();
                }
            };
            this.stage.addChild(this.player.ball);
            this.stage.addChild(Game.ui);
        };
        Game.prototype.activate = function () {
            var _this = this;
            if(!this.player.ready) {
                return;
            }
            this.player.ready = false;
            var line = this.board.getLine(this.player.column);
            var nextLine = this.board.getLine(this.player.column + 1);
            var stunt = new stunts.AddPlatform(line, nextLine, this.player, function () {
                _this.success();
            }, function () {
                _this.failure();
            });
            stunt.go();
            this.player.power = 0;
        };
        Game.prototype.success = function () {
            this.player.height = this.board.getLine(this.player.column).size();
            this.player.column++;
            this.player.combo += 10;
            console.log(this.player.combo);
        };
        Game.prototype.failure = function () {
            this.player.ready = true;
            this.player.combo = 0;
        };
        Game.prototype.update = function () {
            if(this.player.progress > Game.width / 2) {
                this.cameraOffset = this.player.progress - (Game.width / 2);
            } else {
                this.cameraOffset = 0;
            }
            this.player.ball.x = this.player.progress - this.cameraOffset;
            this.player.ball.y = this.board.getLine(this.player.column).y;
            this.board.x = -this.cameraOffset;
            Game.ui.update(this.player);
            this.stage.update();
        };
        return Game;
    })();
    exports.Game = Game;    
    require([], function () {
        var el = document.getElementById('game');
        el.width = window.innerWidth;
        el.height = window.innerHeight;
        var game = new Game(el);
    });
})
//@ sourceMappingURL=game.js.map
