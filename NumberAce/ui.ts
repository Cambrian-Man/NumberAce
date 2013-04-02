import game = module("game");
import control = module("control");
import stunts = module("stunts");

export class UI extends createjs.Container{
    public static tablet = "tablet";
    public static mobile = "mobile";
    public static web = "web";

    private powerDisplay: createjs.Text;
    private comboMeter: createjs.DisplayObject;
    private comboMask: createjs.Shape;

    private scoreDisplay: createjs.Text;

    public powerUpButton: createjs.Bitmap;
    public powerDownButton: createjs.Bitmap;
    public activateButton: createjs.Bitmap;

    public carousel: StuntCarousel;
    public switchForwardButton: createjs.Shape;
    public switchBackwardButton: createjs.Shape;

    constructor(public type, queue:createjs.LoadQueue) {
        super();

        if (this.type == UI.tablet) {
            this.createControls(queue);
        }

        var meterWidth = Math.floor(game.Game.width / 4);

        var g: createjs.Graphics = new createjs.Graphics();
        g.beginLinearGradientFill(["#F00", "#0F0"], [0, 1], 0, 0, meterWidth, 0);
        g.rect(meterWidth / 8, meterWidth / 8, meterWidth, meterWidth / 4);
        this.comboMeter = new createjs.Shape(g);

        this.comboMask = new createjs.Shape(g);
        this.comboMeter.mask = this.comboMask;

        var comboImage = <HTMLImageElement> queue.getResult("comboMeter");
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
        if ((game.Game.width / game.Game.height) < 1.3) {
            this.scoreDisplay.x = comboDisplay.x;
            this.scoreDisplay.y = comboDisplay.y + (meterWidth / 4);
        }
        else {
            this.scoreDisplay.x = meterWidth + (meterWidth / 4);
            this.scoreDisplay.y = comboDisplay.y + (meterWidth / 16);
        }

        this.addChild(this.scoreDisplay);

        this.createPower();
    }

    private createControls(queue : createjs.LoadQueue) {
        var buttonSize = game.Game.blockSize * 2;

        var g = new createjs.Graphics();
        g.beginFill("rgba(255, 255, 255, 0.1)");
        g.rect(0, 0, buttonSize, buttonSize);

        var upArrow = <HTMLImageElement> queue.getResult("upArrow")
        this.powerUpButton = new createjs.Bitmap(upArrow);
        this.powerUpButton.alpha = 0.6;
        this.powerUpButton.scaleX = buttonSize / upArrow.width;
        this.powerUpButton.scaleY = buttonSize / upArrow.width;
        this.powerUpButton.x = game.Game.width - (buttonSize * 3);
        this.powerUpButton.y = game.Game.height - (buttonSize * 3 + (buttonSize * 0.25));
        this.addChild(this.powerUpButton);

        var downArrow = <HTMLImageElement> queue.getResult("downArrow");
        this.powerDownButton = new createjs.Bitmap(downArrow);
        this.powerDownButton.alpha = 0.6;
        this.powerDownButton.scaleX = buttonSize / downArrow.width;
        this.powerDownButton.scaleY = buttonSize / downArrow.width;
        this.powerDownButton.x = game.Game.width - (buttonSize * 3);
        this.powerDownButton.y = game.Game.height - (buttonSize + (buttonSize * 0.25));
        this.addChild(this.powerDownButton);

        var goButton = <HTMLImageElement> queue.getResult("goButton");
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
    }

    private createPower() {
        this.powerDisplay = new createjs.Text("", (game.Game.blockSize * 4) + "px Fredoka One", "#FFF");
        this.powerDisplay.textAlign = "center";
        this.powerDisplay.x = game.Game.width - game.Game.width / 4;
        this.powerDisplay.y = this.comboMeter.y;
        this.powerDisplay.alpha = 0.6;
        this.addChild(this.powerDisplay);
    }
    
    update(player: control.Player) {
        this.updatePower(player);
        this.updateCombo(player);
        this.updateScore(player);
    }

    updateCombo(player: control.Player) {
        (player.combo / 100) < 1 ? this.comboMask.scaleX = (player.combo / 100) : this.scaleX = 1;
    }

    updateScore(player: control.Player) {
        this.scoreDisplay.text = "Score " + player.score;
    }

    updatePower(player: control.Player) {
        var text: string;
        if (player.mode == control.Player.addMode) {
            text = "+ " + player.power.toString();
        }
        else if (player.mode == control.Player.subtractMode) {
            text = "- " + player.power.toString();
        }

        if (this.powerDisplay.text != text) {
            this.powerDisplay.text = text;

            if (player.power == 0) {
                return;
            }

            var tempDisplay: createjs.Text = new createjs.Text(text, (game.Game.blockSize * 4) + "px Fredoka One", "#FFF");
            tempDisplay.textAlign = "center";
            tempDisplay.x = this.powerDisplay.x;
            tempDisplay.y = this.powerDisplay.y;
            tempDisplay.alpha = 0.4;

            var targetY: number;
            if (player.mode == control.Player.addMode) {
                targetY = 0 - game.Game.blockSize * 4;
            }
            else if (player.mode == control.Player.subtractMode) {
                targetY = this.powerDisplay.y + game.Game.blockSize * 4;
            }

            this.addChild(tempDisplay);
            createjs.Tween.get(tempDisplay).to({ y: targetY, alpha: 0}, 300).call(() => {
                this.removeChild(tempDisplay);
            });
        }
    }    
}

export class StuntCarousel extends createjs.Container {
    public next: createjs.Bitmap;
    public current: createjs.Bitmap;
    public previous: createjs.Bitmap;

    private player: control.Player;

    constructor(private queue: createjs.LoadQueue) {
        super();
    }

    public buildIcons(player: control.Player) {
        this.player = player;
        this.previous = this.newButton(player.currentStunt - 1);
        this.previous.alpha = 0.5;

        this.current = this.newButton(player.currentStunt);
        this.current.alpha = 1;

        this.next = this.newButton(player.currentStunt + 1);
        this.next.alpha = 0.5;
    }

    private newButton(num): createjs.Bitmap {
        var stunt = num % this.player.stunts.length;
        if (stunt < 0) {
            stunt = this.player.stunts.length + num;
        }

        var buttonSize = game.Game.blockSize * 2;
        var image = <HTMLImageElement> stunts.Stunt.icons[this.player.stunts[stunt].name];
        var button = new createjs.Bitmap(image);

        button.scaleX = buttonSize / 480;
        button.scaleY = buttonSize / 480;
        button.x = this.getXOffset(num + 1);
        button.y = game.Game.height - ((buttonSize * 2) + (buttonSize * 0.25));
        button.alpha = 0.5;
        this.addChild(button);

        return button;
    }

    public static loadIcons(queue: createjs.LoadQueue) {
        stunts.Stunt.icons["RaisePlatform"] = queue.getResult("raisePlatform");
        stunts.Stunt.icons["LowerPlatform"] = queue.getResult("lowerPlatform");
    }

    public forward() {
        var current = this.current;
        var next = this.next;
        var previous = this.previous;

        createjs.Tween.get(this.current).to({ x: this.getXOffset(2), alpha: 0.5 }, 300).call(() => {
            this.next = current;
        });

        createjs.Tween.get(this.previous).to({ x: this.getXOffset(1), alpha: 1 }, 300).call(() => {
            this.current = previous;
        });

        createjs.Tween.get(this.next).to({ x: this.getXOffset(3), alpha: 0 }, 300).call(() => {
            this.removeChild(next)
        });

        var newButton = this.newButton(this.player.currentStunt - 1);
        newButton.x = this.getXOffset(-1);
        newButton.alpha = 0;
        createjs.Tween.get(newButton).to({ x: this.getXOffset(0), alpha: 0.5 }, 300).call(() => {
            this.previous = newButton;
        });
        this.addChild(newButton);
    }

    public back() {
        var current = this.current;
        var next = this.next;
        var previous = this.previous;

        createjs.Tween.get(this.current).to({ x: this.getXOffset(0), alpha: 0.5 }, 300).call(() => {
            this.previous = current;
        });

        createjs.Tween.get(this.previous).to({ x: this.getXOffset(-1), alpha: 0 }, 300).call(() => {
            this.removeChild(previous);
        });

        createjs.Tween.get(this.next).to({ x: this.getXOffset(1), alpha: 1 }, 300).call(() => {
            this.current = next;
        });

        var newButton = this.newButton(this.player.currentStunt + 1);
        newButton.x = this.getXOffset(3);
        newButton.alpha = 0;
        createjs.Tween.get(newButton).to({ x: this.getXOffset(2), alpha: 0.5 }, 300).call(() => {
            this.next = newButton;
        });
        this.addChild(newButton);
    }

    getXOffset(n: number) {
        return game.Game.width - ((game.Game.blockSize * 2) * (4 - n));
    }

    setIcon(item: string, image: HTMLImageElement) {
        var icon: createjs.Bitmap;

        if (item == "next") {
            icon = this.next;
        }
        else if (item == "current") {
            icon = this.current;
        }
        else if (item == "previous") {
            icon = this.previous;
        }

        icon.image = image;
    }
}