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
                id: "background",
                src: "./graphics/background.png"
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
                id: "raisePlatform",
                src: "./graphics/raisePlatform.png"
            });
            this.queue.loadFile({
                id: "lowerPlatform",
                src: "./graphics/lowerPlatform.png"
            });
            this.queue.loadFile({
                id: "goButton",
                src: "./graphics/goButton.png"
            });
            this.queue.loadFile({
                id: "comboMeter",
                src: "./graphics/comboMeter.png"
            });
            this.queue.addEventListener("complete", function () {
                _this.gameSetup();
            });
            stunts.Stunt.queue = this.queue;
        }
        Game.prototype.gameSetup = function () {
            var _this = this;
            this.stage.removeAllChildren();
            createjs.Ticker.addEventListener("tick", function () {
                _this.update();
            });
            Game.ui = new ui.UI(ui.UI.tablet, this.queue);
            ui.StuntCarousel.loadIcons(this.queue);
            Game.controls = new control.Controls(control.Controls.touch);
            // Build the background.
            var backBitmap = this.queue.getResult("background");
            this.background = new createjs.Container();
            var compWidth = (Game.height / backBitmap.height) * backBitmap.width;
            for(var i = 0; i < Game.width / compWidth; i++) {
                var backComponent = new createjs.Bitmap(backBitmap);
                backComponent.scaleY = Game.height / backBitmap.height;
                backComponent.scaleX = Game.height / backBitmap.height;
                backComponent.x = compWidth * i;
                (this.background).addChild(backComponent);
            }
            this.stage.addChild(this.background);
            this.gameStart();
        };
        Game.prototype.gameStart = function () {
            var _this = this;
            this.board = new board.Board(this.queue);
            stunts.Stunt.board = this.board;
            this.stage.addChild(this.board);
            this.player = new control.Player(this.queue);
            this.player.column = 0;
            this.player.power = 0;
            this.player.height = this.board.getLine(0).size();
            Game.ui.carousel.buildIcons(this.player);
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
            clearInterval(this.drainTimer);
            this.drainTimer = null;
            var line = this.board.getLine(this.player.column);
            var nextLine = this.board.getLine(this.player.column + 1);
            var stunt = new this.player.stunts[this.player.currentStunt](line, nextLine, this.player, function () {
                _this.success();
            }, function () {
                _this.failure();
            });
            if(this.player.mode == control.Player.subtractMode && line.size() - this.player.power <= 0) {
                this.failure();
            } else {
                stunt.go();
            }
            this.player.power = 0;
        };
        Game.prototype.drainCombo = function () {
            if(this.player.combo > 0) {
                this.player.combo -= 1;
            }
        };
        Game.prototype.success = function () {
            this.player.height = this.board.getLine(this.player.column).size();
            this.player.column++;
            if(this.player.column == this.board.size()) {
                this.showEnding();
                return;
            }
            if(this.player.combo < 100) {
                this.player.combo += 10;
            } else {
                this.player.combo = 100;
            }
            this.player.score += (10 + this.player.combo);
        };
        Game.prototype.failure = function () {
            this.player.ready = true;
            this.player.combo = 0;
        };
        Game.prototype.update = function () {
            var _this = this;
            if(this.player.progress > Game.width / 2) {
                this.cameraOffset = this.player.progress - (Game.width / 2);
            } else {
                this.cameraOffset = 0;
            }
            this.player.ball.x = this.player.progress - this.cameraOffset;
            this.player.ball.y = this.board.getLine(this.player.column).y;
            this.board.x = -this.cameraOffset;
            Game.ui.update(this.player);
            if(this.player.ready && !this.drainTimer) {
                this.drainTimer = setInterval(function () {
                    _this.drainCombo();
                }, 1000);
            }
            this.stage.update();
        };
        Game.prototype.showEnding = function () {
            var _this = this;
            var endText = new createjs.Text("Your Score is " + this.player.score, Game.width / 30 + "px Fredoka One", "#FFF");
            endText.x = Game.width / 2;
            endText.y = Game.height / 2;
            endText.textAlign = "center";
            this.stage.addChild(endText);
            this.player.ready = false;
            this.stage.update();
            var goOn = function () {
                _this.gameSetup();
                window.removeEventListener("click", goOn);
            };
            window.addEventListener("click", goOn);
            createjs.Ticker.removeAllListeners();
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
