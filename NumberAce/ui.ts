import game = module("game");
import control = module("control");

export class UI extends createjs.Container{
    public static tablet = "tablet";
    public static mobile = "mobile";
    public static web = "web";

    private powerDisplay: createjs.Text;

    public powerUpButton: createjs.Shape;
    public powerDownButton: createjs.Shape;
    public activateButton: createjs.Shape;
    public switchForwardButton: createjs.Shape;
    public switchBackwardButton: createjs.Shape;

    constructor(public type, queue) {
        super();

        if (this.type == UI.tablet) {
            this.createControls();
        }

        this.powerDisplay = new createjs.Text("", "32px Arial", "#000");
        this.powerDisplay.x = game.Game.width - 128;
        this.addChild(this.powerDisplay);
    }

    private createControls() {
        var buttonSize = game.Game.blockSize * 1.5

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
    }

    updatePower(player: control.Player) {
        var text: string;
        if (player.mode == control.Player.addMode) {
            text = "+ " + player.power.toString();
        }
        else if (player.mode == control.Player.subtractMode) {
            text = "- " + player.power.toString();
        }

        this.powerDisplay.text = text;
    }
}