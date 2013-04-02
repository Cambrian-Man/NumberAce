var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "game", "control", "stunts"], function(require, exports, __game__, __control__, __stunts__) {
    var game = __game__;

    var control = __control__;

    var stunts = __stunts__;

    var UI = (function (_super) {
        __extends(UI, _super);
        function UI(type, queue) {
                _super.call(this);
            this.type = type;
            if(this.type == UI.tablet) {
                this.createControls(queue);
            }
            var meterWidth = Math.floor(game.Game.width / 4);
            var g = new createjs.Graphics();
            g.beginLinearGradientFill([
                "#F00", 
                "#0F0"
            ], [
                0, 
                1
            ], 0, 0, meterWidth, 0);
            g.rect(meterWidth / 8, meterWidth / 8, meterWidth, meterWidth / 4);
            this.comboMeter = new createjs.Shape(g);
            this.comboMask = new createjs.Shape(g);
            this.comboMeter.mask = this.comboMask;
            var comboImage = queue.getResult("comboMeter");
            var comboDisplay = new createjs.Bitmap(comboImage);
            comboDisplay.x = meterWidth / 8;
            comboDisplay.y = meterWidth / 8;
            comboDisplay.scaleX = meterWidth / comboImage.width;
            comboDisplay.scaleY = meterWidth / comboImage.width;
            this.addChild(this.comboMeter);
            this.addChild(comboDisplay);
            StuntCarousel.loadIcons(queue);
            this.carousel = new StuntCarousel(queue);
            this.addChild(this.carousel);
            this.scoreDisplay = new createjs.Text("Score 0", game.Game.blockSize + "px Fredoka One", "#FFF");
            this.scoreDisplay.alpha = 0.6;
            // Set position based on aspect ratio.
            if((game.Game.width / game.Game.height) < 1.3) {
                this.scoreDisplay.x = comboDisplay.x;
                this.scoreDisplay.y = comboDisplay.y + (meterWidth / 4);
            } else {
                this.scoreDisplay.x = meterWidth + (meterWidth / 4);
                this.scoreDisplay.y = comboDisplay.y + (meterWidth / 16);
            }
            this.addChild(this.scoreDisplay);
            this.createPower();
        }
        UI.tablet = "tablet";
        UI.mobile = "mobile";
        UI.web = "web";
        UI.prototype.createControls = function (queue) {
            var buttonSize = game.Game.blockSize * 2;
            var g = new createjs.Graphics();
            g.beginFill("rgba(255, 255, 255, 0.1)");
            g.rect(0, 0, buttonSize, buttonSize);
            var upArrow = queue.getResult("upArrow");
            this.powerUpButton = new createjs.Bitmap(upArrow);
            this.powerUpButton.alpha = 0.6;
            this.powerUpButton.scaleX = buttonSize / upArrow.width;
            this.powerUpButton.scaleY = buttonSize / upArrow.width;
            this.powerUpButton.x = game.Game.width - (buttonSize * 3);
            this.powerUpButton.y = game.Game.height - (buttonSize * 3 + (buttonSize * 0.25));
            this.addChild(this.powerUpButton);
            var downArrow = queue.getResult("downArrow");
            this.powerDownButton = new createjs.Bitmap(downArrow);
            this.powerDownButton.alpha = 0.6;
            this.powerDownButton.scaleX = buttonSize / downArrow.width;
            this.powerDownButton.scaleY = buttonSize / downArrow.width;
            this.powerDownButton.x = game.Game.width - (buttonSize * 3);
            this.powerDownButton.y = game.Game.height - (buttonSize + (buttonSize * 0.25));
            this.addChild(this.powerDownButton);
            var goButton = queue.getResult("goButton");
            this.activateButton = new createjs.Bitmap(goButton);
            this.activateButton.alpha = 0.1;
            this.activateButton.scaleX = buttonSize / goButton.width;
            this.activateButton.scaleY = buttonSize / goButton.width;
            this.activateButton.x = game.Game.width - (buttonSize * 3);
            this.activateButton.y = game.Game.height - ((buttonSize * 2) + (buttonSize * 0.25));
            this.addChild(this.activateButton);
            this.switchForwardButton = new createjs.Shape(g);
            this.switchForwardButton.x = game.Game.width - (buttonSize * 2);
            this.switchForwardButton.y = game.Game.height - ((buttonSize * 2) + (buttonSize * 0.25));
            this.addChild(this.switchForwardButton);
            this.switchBackwardButton = new createjs.Shape(g);
            this.switchBackwardButton.x = game.Game.width - (buttonSize * 4);
            this.switchBackwardButton.y = game.Game.height - ((buttonSize * 2) + (buttonSize * 0.25));
            this.addChild(this.switchBackwardButton);
        };
        UI.prototype.createPower = function () {
            this.powerDisplay = new createjs.Text("", (game.Game.blockSize * 4) + "px Fredoka One", "#FFF");
            this.powerDisplay.textAlign = "center";
            this.powerDisplay.x = game.Game.width - game.Game.width / 4;
            this.powerDisplay.y = this.comboMeter.y;
            this.powerDisplay.alpha = 0.6;
            this.addChild(this.powerDisplay);
        };
        UI.prototype.update = function (player) {
            this.updatePower(player);
            this.updateCombo(player);
            this.updateScore(player);
        };
        UI.prototype.updateCombo = function (player) {
            (player.combo / 100) < 1 ? this.comboMask.scaleX = (player.combo / 100) : this.scaleX = 1;
        };
        UI.prototype.updateScore = function (player) {
            this.scoreDisplay.text = "Score " + player.score;
        };
        UI.prototype.updatePower = function (player) {
            var _this = this;
            var text;
            if(player.mode == control.Player.addMode) {
                text = "+ " + player.power.toString();
            } else if(player.mode == control.Player.subtractMode) {
                text = "- " + player.power.toString();
            }
            if(this.powerDisplay.text != text) {
                this.powerDisplay.text = text;
                if(player.power == 0) {
                    return;
                }
                var tempDisplay = new createjs.Text(text, (game.Game.blockSize * 4) + "px Fredoka One", "#FFF");
                tempDisplay.textAlign = "center";
                tempDisplay.x = this.powerDisplay.x;
                tempDisplay.y = this.powerDisplay.y;
                tempDisplay.alpha = 0.4;
                var targetY;
                if(player.mode == control.Player.addMode) {
                    targetY = 0 - game.Game.blockSize * 4;
                } else if(player.mode == control.Player.subtractMode) {
                    targetY = this.powerDisplay.y + game.Game.blockSize * 4;
                }
                this.addChild(tempDisplay);
                createjs.Tween.get(tempDisplay).to({
                    y: targetY,
                    alpha: 0
                }, 300).call(function () {
                    _this.removeChild(tempDisplay);
                });
            }
        };
        return UI;
    })(createjs.Container);
    exports.UI = UI;    
    var StuntCarousel = (function (_super) {
        __extends(StuntCarousel, _super);
        function StuntCarousel(queue) {
                _super.call(this);
            this.queue = queue;
        }
        StuntCarousel.prototype.buildIcons = function (player) {
            this.player = player;
            this.previous = this.newButton(player.currentStunt - 1);
            this.previous.alpha = 0.5;
            this.current = this.newButton(player.currentStunt);
            this.current.alpha = 1;
            this.next = this.newButton(player.currentStunt + 1);
            this.next.alpha = 0.5;
        };
        StuntCarousel.prototype.newButton = function (num) {
            var stunt = num % this.player.stunts.length;
            if(stunt < 0) {
                stunt = this.player.stunts.length + num;
            }
            var buttonSize = game.Game.blockSize * 2;
            var image = stunts.Stunt.icons[this.player.stunts[stunt].name];
            var button = new createjs.Bitmap(image);
            button.scaleX = buttonSize / 480;
            button.scaleY = buttonSize / 480;
            button.x = this.getXOffset(num + 1);
            button.y = game.Game.height - ((buttonSize * 2) + (buttonSize * 0.25));
            button.alpha = 0.5;
            this.addChild(button);
            return button;
        };
        StuntCarousel.loadIcons = function loadIcons(queue) {
            stunts.Stunt.icons["RaisePlatform"] = queue.getResult("raisePlatform");
            stunts.Stunt.icons["LowerPlatform"] = queue.getResult("lowerPlatform");
        };
        StuntCarousel.prototype.forward = function () {
            var _this = this;
            var current = this.current;
            var next = this.next;
            var previous = this.previous;
            createjs.Tween.get(this.current).to({
                x: this.getXOffset(2),
                alpha: 0.5
            }, 300).call(function () {
                _this.next = current;
            });
            createjs.Tween.get(this.previous).to({
                x: this.getXOffset(1),
                alpha: 1
            }, 300).call(function () {
                _this.current = previous;
            });
            createjs.Tween.get(this.next).to({
                x: this.getXOffset(3),
                alpha: 0
            }, 300).call(function () {
                _this.removeChild(next);
            });
            var newButton = this.newButton(this.player.currentStunt - 1);
            newButton.x = this.getXOffset(-1);
            newButton.alpha = 0;
            createjs.Tween.get(newButton).to({
                x: this.getXOffset(0),
                alpha: 0.5
            }, 300).call(function () {
                _this.previous = newButton;
            });
            this.addChild(newButton);
        };
        StuntCarousel.prototype.back = function () {
            var _this = this;
            var current = this.current;
            var next = this.next;
            var previous = this.previous;
            createjs.Tween.get(this.current).to({
                x: this.getXOffset(0),
                alpha: 0.5
            }, 300).call(function () {
                _this.previous = current;
            });
            createjs.Tween.get(this.previous).to({
                x: this.getXOffset(-1),
                alpha: 0
            }, 300).call(function () {
                _this.removeChild(previous);
            });
            createjs.Tween.get(this.next).to({
                x: this.getXOffset(1),
                alpha: 1
            }, 300).call(function () {
                _this.current = next;
            });
            var newButton = this.newButton(this.player.currentStunt + 1);
            newButton.x = this.getXOffset(3);
            newButton.alpha = 0;
            createjs.Tween.get(newButton).to({
                x: this.getXOffset(2),
                alpha: 0.5
            }, 300).call(function () {
                _this.next = newButton;
            });
            this.addChild(newButton);
        };
        StuntCarousel.prototype.getXOffset = function (n) {
            return game.Game.width - ((game.Game.blockSize * 2) * (4 - n));
        };
        StuntCarousel.prototype.setIcon = function (item, image) {
            var icon;
            if(item == "next") {
                icon = this.next;
            } else if(item == "current") {
                icon = this.current;
            } else if(item == "previous") {
                icon = this.previous;
            }
            icon.image = image;
        };
        return StuntCarousel;
    })(createjs.Container);
    exports.StuntCarousel = StuntCarousel;    
})
//@ sourceMappingURL=ui.js.map
