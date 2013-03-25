import game = module("game");

export class Board extends createjs.Container{
    private lines: Line[];

    constructor(queue:createjs.LoadQueue) {
        super();

        Block.blockGraphic = <HTMLImageElement> queue.getResult("block");

        this.lines = [];
        for (var i = 0; i < 30; i++) {
            var height = Math.floor((Math.random() * 10)) + 1;
            this.addLine(height);
        }
    }

    addLine(height: number) {
        var l = new Line(height);
        l.x = game.Game.blockSize * this.lines.length;

        this.lines.push(l);
        this.addChild(l);
    }

    getLine(column: number) {
        return this.lines[column];
    }
}

export class Line extends createjs.Container {
    private blocks: Block[];

    private count: createjs.Text;

    private _size: number = 0;

    constructor(height:number) {
        super();

        this.count = new createjs.Text("", Math.floor(game.Game.blockSize / 2) + "px Helvetica", "#FFF");
        this.count.x = game.Game.blockSize / 2;
        this.count.lineWidth = game.Game.blockSize;
        this.count.lineHeight = game.Game.blockSize;
        this.count.textAlign = "center";
        this.addChild(this.count);

        this.blocks = [];

        this.addBlocks(height);
    }

    addBlocks(num: number, animate?: bool, onComplete?:Function) {
        var add = () => {
            this._size++;
            var b: Block = new Block();
            b.y = this.size() * game.Game.blockSize;
            this.blocks.push(b);
            this.addChild(b);
            this.blocksUpdated();
        }

        var cycleAdd = (times: number) => {
            if (times < num) {
                add();
                createjs.Tween
                    .get(this)
                    .to({ y: (game.Game.height - game.Game.blockSize) - (this.size() * game.Game.blockSize) }, 500, createjs.Ease.bounceOut)
                    .call(cycleAdd, [times + 1]);
            }
            else {
                if (onComplete) {
                    onComplete();
                }
            }
        }


        if (!animate) {
            for (var i = 0; i < num; i++) {
                add();
                this.y = (game.Game.height - game.Game.blockSize) - (this.size() * game.Game.blockSize);
            }
        }
        else {
            cycleAdd(0);
        }
    }

    removeBlocks(num: number, animate?: bool, onComplete?:Function) {
        if (this._size == 0) {
            throw "No blocks left.";
        }

        var remove = () => {
            this._size--;
            var b: Block = this.blocks.pop();
            this.removeChild(b);
            this.blocksUpdated();
        }

        var cycleRemove = (times: number) => {
            if (times < num) {
                remove();
                createjs.Tween
                    .get(this)
                    .to({ y: (game.Game.height - game.Game.blockSize) - (this.size() * game.Game.blockSize) }, 500, createjs.Ease.bounceOut)
                    .call(cycleRemove, [times + 1]);
            }
            else {
                if (onComplete) {
                    onComplete();
                }
            }
        }

        if (!animate) {
            for (var i = 0; i < num; i++) {
                remove();
            }
        }
        else {
            cycleRemove(0);
        }
    }

    private blocksUpdated() {
        this.removeChild(this.count);
        this.count.text = this.size().toString();
        this.count.y = this.blocks[0].y + (game.Game.blockSize / 5);
        this.addChild(this.count);
    }

    size(): number {
        return this._size;
    }
}

class Block extends createjs.Bitmap {
    public static blockGraphic: HTMLImageElement;

    constructor() {
        super(Block.blockGraphic);
        this.scaleX = game.Game.blockSize / Block.blockGraphic.width;
        this.scaleY = game.Game.blockSize / Block.blockGraphic.height;
    }
}