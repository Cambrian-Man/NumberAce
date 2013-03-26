import board = module("board");
import game = module("game");
import control = module("control");

export class Stunt {
    public static board: board.Board;

    constructor(public from: board.Line, public to: board.Line, public player:control.Player, public success: Function, public failure:Function) {
        
    }

    go() {
        throw "Need to override this";
    }
}

export class AddPlatform extends Stunt {
    private platform: createjs.DisplayObject;

    go() {
        var g: createjs.Graphics = new createjs.Graphics();
        g.beginFill("#000").rect(0, 0, this.to.x - (this.from.x + game.Game.blockSize), game.Game.blockSize);
        this.platform = new createjs.Shape(g);
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
                Stunt.board.addChild(this.platform);
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