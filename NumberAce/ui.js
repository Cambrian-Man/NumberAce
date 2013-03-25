var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "game", "control"], function(require, exports, __game__, __control__) {
    var game = __game__;

    var control = __control__;

    var UI = (function (_super) {
        __extends(UI, _super);
        function UI(type, queue) {
                _super.call(this);
            this.type = type;
            if(this.type == UI.tablet) {
                this.createControls();
            }
            this.powerDisplay = new createjs.Text("", "32px Arial", "#000");
            this.powerDisplay.x = game.Game.width - 128;
            this.addChild(this.powerDisplay);
        }
        UI.tablet = "tablet";
        UI.mobile = "mobile";
        UI.web = "web";
        UI.prototype.createControls = function () {
            var buttonSize = game.Game.blockSize * 1.5;
            var g = new createjs.Graphics();
            g.beginStroke("#000");
            g.beginFill("rgba(255, 255, 255, 0.3)");
            g.rect(0, 0, buttonSize, buttonSize);
            this.powerUpButton = new createjs.Shape(g);
            this.powerUpButton.cache(0, 0, buttonSize, buttonSize);
            this.powerUpButton.x = game.Game.width - (buttonSize * 3);
            this.powerUpButton.y = buttonSize * 0.25;
            this.addChild(this.powerUpButton);
            this.powerDownButton = new createjs.Shape(g);
            this.powerDownButton.x = game.Game.width - (buttonSize * 3);
            this.powerDownButton.y = buttonSize * 2 + (buttonSize * 0.25);
            this.addChild(this.powerDownButton);
            this.activateButton = new createjs.Shape(g);
            this.activateButton.x = game.Game.width - (buttonSize * 3);
            this.activateButton.y = buttonSize + (buttonSize * 0.25);
            this.addChild(this.activateButton);
            this.switchForwardButton = new createjs.Shape(g);
            this.switchForwardButton.x = game.Game.width - (buttonSize * 2);
            this.switchForwardButton.y = buttonSize + (buttonSize * 0.25);
            this.addChild(this.switchForwardButton);
            this.switchBackwardButton = new createjs.Shape(g);
            this.switchBackwardButton.x = game.Game.width - (buttonSize * 4);
            this.switchBackwardButton.y = buttonSize + (buttonSize * 0.25);
            this.addChild(this.switchBackwardButton);
        };
        UI.prototype.updatePower = function (player) {
            var text;
            if(player.mode == control.Player.addMode) {
                text = "+ " + player.power.toString();
            } else if(player.mode == control.Player.subtractMode) {
                text = "- " + player.power.toString();
            }
            this.powerDisplay.text = text;
        };
        return UI;
    })(createjs.Container);
    exports.UI = UI;    
})
//@ sourceMappingURL=ui.js.map
