import board = module("board");
import game = module("game");
import control = module("control");

export class Stunt {
    public static board: board.Board;
    public static queue: createjs.LoadQueue;

    public static add: string = "add";
    public static subtract: string = "subtract";
    public static both: string = "both";

    public static icons = {};

    public type: string;
    
    constructor(public from: board.Line, public to: board.Line, public player:control.Player, public success: Function, public failure:Function) {
        
    }

    go() {
        throw "Need to override this";
    }
}

export class AddPlatform extends Stunt {
    private platform: createjs.DisplayObject;
    public static type = Stunt.both;

    go() {
        var platformImage = <HTMLImageElement> Stunt.queue.getResult("platform");
        this.platform = new createjs.Bitmap(platformImage);
        this.platform.scaleY = game.Game.blockSize / platformImage.height;
        this.platform.scaleX = game.Game.blockSize / platformImage.height;
        Stunt.board.addChild(this.platform);
        this.platform.x = this.from.x + game.Game.blockSize;
        this.platform.y = game.Game.height;

        createjs.Tween.get(this.platform).to({ y: this.to.y + game.Game.blockSize }, 30 * this.to.size());

        var amount: number;
        (this.player.mode == control.Player.addMode) ? amount = this.player.power : amount = -this.player.power;
        this.shiftPlatform(amount, () => {
            if (this.from.size() == this.to.size()) {
                this.animateProgress();
            }
            else {
                this.failure();
                createjs.Tween.get(this.platform)
                    .to({ y: game.Game.height + (game.Game.blockSize * 4) }, 1000, createjs.Ease.getPowIn(2.5))
                    .call(() => {
                        Stunt.board.removeChild(this.platform);
                    });
            }
            
        });
    }

    shiftPlatform(amount: number, callback: Function) {
        var cycle = (times: number) => {
            if (times < Math.abs(amount)) {
                if (amount > 0) {
                    this.from.changeBlocks(1, true);
                }
                else {
                    this.from.changeBlocks(-1, true);
                }

                createjs.Tween
                    .get(this.from)
                    .to({ y: (game.Game.height - game.Game.blockSize) - (this.from.size() * game.Game.blockSize) }, 500, createjs.Ease.bounceOut)
                    .call(cycle, [times + 1]);
            }
            else {
                if (callback) {
                    callback();
                }
            }
        }

        cycle(0);
    }

    animateProgress() {
        var completed: Function = () => {
            this.player.ready = true;
            this.success();
        }

        createjs.Tween
            .get(this.player)
            .to({ progress: this.to.x }, 500, createjs.Ease.sineInOut)
            .call(() => {
                createjs.Tween.get(this.platform)
                    .to({ y: game.Game.height + (game.Game.blockSize * 4), rotation: 90 }, 1000, createjs.Ease.getPowOut(2.5)).call(() => {
                        Stunt.board.removeChild(this.platform);
                    });
                completed();
            });
    }
}


export class RaisePlatform extends AddPlatform {
    public static type = Stunt.add;
}

export class LowerPlatform extends AddPlatform {
    public static type = Stunt.subtract;
}

export class Pinball extends Stunt{
    go() {
        var amount: number;
        (this.player.mode == control.Player.addMode) ? amount = this.player.power : amount = -this.player.power;

        // This is subtract-only.
        if (amount > 0) {
            this.player.ready = true;
            return;
        }

        this.fly(amount);
    }

    fly(amount:number) {
        var completed: Function = () => {
            this.player.ready = true;
            this.success();
        }

        createjs.Tween
            .get(this.player)
            .to({ progress: this.to.x }, 200, createjs.Ease.bounceOut)
            .call(() => {
                completed();
            });

        createjs.Tween
            .get(this.player.ball)
            .to({ y: this.to.y }, 100 * amount, createjs.Ease.sineOut);
    }
}