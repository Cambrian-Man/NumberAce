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
                this.createControls(queue);
            }
            this.powerDisplay = new createjs.Text("", "32px Arial", "#000");
            this.powerDisplay.x = game.Game.width - 128;
            this.addChild(this.powerDisplay);
        }
        UI.tablet = "tablet";
        UI.mobile = "mobile";
        UI.web = "web";
        UI.prototype.createControls = function (queue) {
            var buttonSize = game.Game.blockSize * 2;
            var g = new createjs.Graphics();
            g.beginStroke("#000");
            g.beginFill("rgba(255, 255, 255, 0.3)");
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
            this.activateButton.alpha = 0.6;
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
