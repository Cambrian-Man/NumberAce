import game = module("game");
import control = module("control");

export class UI extends createjs.Container{
    public static tablet = "tablet";
    public static mobile = "mobile";
    public static web = "web";

    private powerDisplay: createjs.Text;

    public powerUpButton: createjs.Bitmap;
    public powerDownButton: createjs.Bitmap;
    public activateButton: createjs.Bitmap;
    public switchForwardButton: createjs.Shape;
    public switchBackwardButton: createjs.Shape;

    constructor(public type, queue) {
        super();

        if (this.type == UI.tablet) {
            this.createControls(queue);
        }

        this.powerDisplay = new createjs.Text("", "32px Arial", "#000");
        this.powerDisplay.x = game.Game.width - 128;
        this.addChild(this.powerDisplay);
    }

    private createControls(queue : createjs.LoadQueue) {
        var buttonSize = game.Game.blockSize * 2;

        var g = new createjs.Graphics();
        g.beginStroke("#000");
        g.beginFill("rgba(255, 255, 255, 0.3)");
        g.rect(0, 0, buttonSize, buttonSize);

        var upArrow = <HTMLImageElement> queue.getResult("upArrow")
        this.powerUpButton = new createjs.Bitmap(upArrow);
        this.powerUpButton.alpha = 0.6;
        this.powerUpButton.scaleX = buttonSize / upArrow.width;
        this.powerUpButton.scaleY = buttonSize / upArrow.width;
        this.powerUpButton.x = game.Game.width - (buttonSize * 3);
        this.powerUpButton.y = buttonSize * 0.25;
        this.addChild(this.powerUpButton);

        var downArrow = <HTMLImageElement> queue.getResult("downArrow");
        this.powerDownButton = new createjs.Bitmap(downArrow);
        this.powerDownButton.alpha = 0.6;
        this.powerDownButton.scaleX = buttonSize / downArrow.width;
        this.powerDownButton.scaleY = buttonSize / downArrow.width;
        this.powerDownButton.x = game.Game.width - (buttonSize * 3);
        this.powerDownButton.y = buttonSize * 2 + (buttonSize * 0.25);
        this.addChild(this.powerDownButton);

        var goButton = <HTMLImageElement> queue.getResult("goButton");
        this.activateButton = new createjs.Bitmap(goButton);
        this.activateButton.alpha = 0.6;
        this.activateButton.scaleX = buttonSize / goButton.width;
        this.activateButton.scaleY = buttonSize / goButton.width;
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