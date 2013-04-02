import game = module("game");
import stunts = module("stunts");

export class Player {
    public static subtractMode = "subtract";
    public static addMode = "add";

    public mode: string;
    public height: number;
    public column: number;
    public power: number;

    public ready: bool;

    public ball: createjs.DisplayObject;
    
    public progress: number;
    public combo: number;
    public score: number;

    public stunts: any[];
    public currentStunt: number;

    public onActivate: Function;

    constructor(queue: createjs.LoadQueue) {
        this.combo = 0;
        this.score = 0;
        var ballImage = <HTMLImageElement> queue.getResult("ball");
        
        this.ball = new createjs.Bitmap(ballImage);
        this.ball.scaleX = game.Game.blockSize / ballImage.width;
        this.ball.scaleY = game.Game.blockSize / ballImage.height;

        game.Game.controls.on(ControlEvent.go, () => {
            this.onActivate();
        });

        game.Game.controls.on(ControlEvent.powerUp, () => {
            if (this.power < 10) {
                this.power++;
            }
        });

        game.Game.controls.on(ControlEvent.powerDown, () => {
            if (this.power > 0) {
                this.power--;
            }
        });

        game.Game.controls.on(ControlEvent.switchForward, () => {
            this.currentStunt++;
            this.currentStunt %= this.stunts.length;
            

            if (this.stunts[this.currentStunt].type == stunts.Stunt.add) {
                this.mode = Player.addMode;
            }
            else {
                this.mode = Player.subtractMode;
            }

            game.Game.ui.carousel.forward();
        });

        game.Game.controls.on(ControlEvent.switchBack, () => {
            this.currentStunt--;
            this.currentStunt %= this.stunts.length;
            if (this.currentStunt < 0) { this.currentStunt = this.stunts.length + this.currentStunt; }

            if (this.stunts[this.currentStunt].type == stunts.Stunt.add) {
                this.mode = Player.addMode;
            }
            else {
                this.mode = Player.subtractMode;
            }

            game.Game.ui.carousel.back();
        });

        this.stunts = [stunts.RaisePlatform, stunts.LowerPlatform];
        this.currentStunt = 0;
        this.mode = Player.addMode;

        this.progress = 0;
        this.ready = true;
    }
}

export class Controls {
    private listeners = {};

    public static keyboard = "keyboard";
    public static touch = "touch";

    constructor(scheme: string) {
        if (scheme == Controls.keyboard) {
            window.addEventListener("keyup", (event: KeyboardEvent) => {
                switch (event.keyCode) {
                    case 32:
                        this.emit(new ControlEvent(ControlEvent.go));
                        break;
                    case 38:
                        this.emit(new ControlEvent(ControlEvent.powerUp));
                        break;
                    case 40:
                        this.emit(new ControlEvent(ControlEvent.powerDown));
                        break;
                    case 39:
                        this.emit(new ControlEvent(ControlEvent.switchForward));
                        break;
                    case 37:
                        this.emit(new ControlEvent(ControlEvent.switchBack));
                        break;
                }

            });
        }
        else if (scheme == Controls.touch) {
            var ui = game.Game.ui;
            ui.powerUpButton.addEventListener("click", () => {
                this.emit(new ControlEvent(ControlEvent.powerUp));
            });

            ui.powerDownButton.addEventListener("click", () => {
                this.emit(new ControlEvent(ControlEvent.powerDown));
            });

            ui.activateButton.addEventListener("click", () => {
                this.emit(new ControlEvent(ControlEvent.go));
            });

            ui.switchForwardButton.addEventListener("click", () => {
                this.emit(new ControlEvent(ControlEvent.switchForward));
            });

            ui.switchBackwardButton.addEventListener("click", () => {
                this.emit(new ControlEvent(ControlEvent.switchBack));
            });
        }

    }

    emit(event: ControlEvent) {
        if (this.listeners[event.type]) {
            var listeners: Function[] = this.listeners[event.type];
            for (var i = 0; i < listeners.length; i++) {
                listeners[i](event);
            }
        }
    }

    on(type: string, callback: Function) {
        if (!this.listeners[type]) {
            this.listeners[type] = new Array();
            this.listeners[type].push(callback);
        }
        else {
            if (this.listeners[type].indexOf(callback) > -1) {
                this.listeners[type].push(callback);
            }
        }
    }
}

export class ControlEvent {
    public static powerUp = "powerUp";
    public static powerDown = "powerDown";
    public static go = "go";
    public static switchForward = "switchForward";
    public static switchBack = "switchBack";

    constructor(public type: string) {
    }
}