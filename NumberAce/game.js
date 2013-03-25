define(["require", "exports", "board", "control", "ui"], function(require, exports, __board__, __control__, __ui__) {
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
            this.queue.addEventListener("complete", function () {
                _this.gameStart();
            });
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
            this.stage.addChild(this.board);
            Game.controls = new control.Controls(control.Controls.touch);
            this.player = new control.Player(this.queue);
            this.player.column = 0;
            this.player.power = 0;
            this.player.height = this.board.getLine(0).size();
            this.setPlayerPosition();
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
            var blocksCompleted = function () {
                if(line.size() == _this.board.getLine(_this.player.column + 1).size()) {
                    _this.success();
                } else {
                    _this.failure();
                }
            };
            if(this.player.mode == control.Player.subtractMode) {
                if(line.size() > 0 || this.player.power == 0) {
                    line.removeBlocks(this.player.power, true, function () {
                        blocksCompleted();
                    });
                }
            } else if(this.player.mode == control.Player.addMode) {
                if(line.size() < 10 || this.player.power == 0) {
                    line.addBlocks(this.player.power, true, function () {
                        blocksCompleted();
                    });
                }
            }
            this.player.power = 0;
        };
        Game.prototype.success = function () {
            this.player.height = this.board.getLine(this.player.column).size();
            this.setPlayerPosition();
            this.player.column++;
            this.animateProgress();
        };
        Game.prototype.failure = function () {
            this.player.ready = true;
        };
        Game.prototype.animateProgress = function () {
            var _this = this;
            var completed = function () {
                _this.player.ready = true;
            };
            var minOffsetColumn = Math.floor(Game.width / Game.blockSize) / 2;
            if(this.player.column > minOffsetColumn) {
                this.cameraOffset = (this.player.column - minOffsetColumn) * Game.blockSize;
            } else {
                this.cameraOffset = 0;
            }
            if(this.cameraOffset == 0) {
                // If we don't need to animate the camera, just move the player.
                createjs.Tween.get(this.player.ball).to({
                    x: this.board.getLine(this.player.column).x
                }, 500, createjs.Ease.sineInOut).call(completed);
            } else {
                // Otherwise, we tween the board.
                createjs.Tween.get(this.board).to({
                    x: -this.cameraOffset
                }, 500, createjs.Ease.sineInOut).call(completed);
            }
        };
        Game.prototype.setPlayerPosition = function () {
            this.player.ball.x = this.board.getLine(this.player.column).x - this.cameraOffset;
            this.player.ball.y = this.board.getLine(this.player.column).y;
        };
        Game.prototype.update = function () {
            if(!createjs.Tween.hasActiveTweens(this.player.ball)) {
                this.setPlayerPosition();
            }
            Game.ui.updatePower(this.player);
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
