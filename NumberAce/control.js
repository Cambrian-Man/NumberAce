define(["require", "exports", "game"], function(require, exports, __game__) {
    var game = __game__;

    var Player = (function () {
        function Player(queue) {
            var _this = this;
            this.combo = 0;
            var ballImage = queue.getResult("ball");
            this.ball = new createjs.Bitmap(ballImage);
            this.ball.scaleX = game.Game.blockSize / ballImage.width;
            this.ball.scaleY = game.Game.blockSize / ballImage.height;
            game.Game.controls.on(ControlEvent.go, function () {
                _this.onActivate();
            });
            game.Game.controls.on(ControlEvent.powerUp, function () {
                if(_this.power < 10) {
                    _this.power++;
                }
            });
            game.Game.controls.on(ControlEvent.powerDown, function () {
                if(_this.power > 0) {
                    _this.power--;
                }
            });
            game.Game.controls.on(ControlEvent.switchForward, function () {
                if(_this.mode == Player.subtractMode) {
                    _this.mode = Player.addMode;
                } else if(_this.mode == Player.addMode) {
                    _this.mode = Player.subtractMode;
                }
            });
            game.Game.controls.on(ControlEvent.switchBack, function () {
                if(_this.mode == Player.subtractMode) {
                    _this.mode = Player.addMode;
                } else if(_this.mode == Player.addMode) {
                    _this.mode = Player.subtractMode;
                }
            });
            this.mode = Player.subtractMode;
            this.progress = 0;
            this.ready = true;
        }
        Player.subtractMode = "subtract";
        Player.addMode = "add";
        return Player;
    })();
    exports.Player = Player;    
    var Controls = (function () {
        function Controls(scheme) {
            var _this = this;
            this.listeners = {
            };
            if(scheme == Controls.keyboard) {
                window.addEventListener("keyup", function (event) {
                    switch(event.keyCode) {
                        case 32:
                            _this.emit(new ControlEvent(ControlEvent.go));
                            break;
                        case 38:
                            _this.emit(new ControlEvent(ControlEvent.powerUp));
                            break;
                        case 40:
                            _this.emit(new ControlEvent(ControlEvent.powerDown));
                            break;
                        case 39:
                            _this.emit(new ControlEvent(ControlEvent.switchForward));
                            break;
                        case 37:
                            _this.emit(new ControlEvent(ControlEvent.switchBack));
                            break;
                    }
                });
            } else if(scheme == Controls.touch) {
                var ui = game.Game.ui;
                ui.powerUpButton.addEventListener("click", function () {
                    _this.emit(new ControlEvent(ControlEvent.powerUp));
                });
                ui.powerDownButton.addEventListener("click", function () {
                    _this.emit(new ControlEvent(ControlEvent.powerDown));
                });
                ui.activateButton.addEventListener("click", function () {
                    _this.emit(new ControlEvent(ControlEvent.go));
                });
                ui.switchForwardButton.addEventListener("click", function () {
                    _this.emit(new ControlEvent(ControlEvent.switchForward));
                });
                ui.switchBackwardButton.addEventListener("click", function () {
                    _this.emit(new ControlEvent(ControlEvent.switchBack));
                });
            }
        }
        Controls.keyboard = "keyboard";
        Controls.touch = "touch";
        Controls.prototype.emit = function (event) {
            if(this.listeners[event.type]) {
                var listeners = this.listeners[event.type];
                for(var i = 0; i < listeners.length; i++) {
                    listeners[i](event);
                }
            }
        };
        Controls.prototype.on = function (type, callback) {
            if(!this.listeners[type]) {
                this.listeners[type] = new Array();
                this.listeners[type].push(callback);
            } else {
                if(this.listeners[type].indexOf(callback) > -1) {
                    this.listeners[type].push(callback);
                }
            }
        };
        return Controls;
    })();
    exports.Controls = Controls;    
    var ControlEvent = (function () {
        function ControlEvent(type) {
            this.type = type;
        }
        ControlEvent.powerUp = "powerUp";
        ControlEvent.powerDown = "powerDown";
        ControlEvent.go = "go";
        ControlEvent.switchForward = "switchForward";
        ControlEvent.switchBack = "switchBack";
        return ControlEvent;
    })();
    exports.ControlEvent = ControlEvent;    
})
//@ sourceMappingURL=control.js.map
