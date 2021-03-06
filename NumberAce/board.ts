import game = module("game");

export class Board extends createjs.Container{
    private lines: Line[];

    constructor(queue:createjs.LoadQueue) {
        super();

        Block.blockGraphic = <HTMLImageElement> queue.getResult("block");
        Block.pistonGraphic = <HTMLImageElement> queue.getResult("piston");

        this.lines = [];
        for (var i = 0; i < 30; i++) {
            var height = Math.floor((Math.random() * 10)) + 1;
            this.addLine(height);
        }
    }

    addLine(height: number) {
        var l = new Line(height);
        l.x = (game.Game.blockSize * 5)* this.lines.length;

        this.lines.push(l);
        this.addChild(l);
    }

    getLine(column: number) {
        return this.lines[column];
    }

    size(): number {
        return this.lines.length - 1;
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

        this.changeBlocks(height);
    }

    changeBlocks(amount: number, leavePosition?:bool) {
        var add = () => {
            this._size++;
            var b: Block = new Block();
            b.y = this.size() * game.Game.blockSize;

            if (this.size() > 1) {
                b.setImage(Block.pistonGraphic);
            }

            this.blocks.push(b);
            this.addChild(b);
            this.blocksUpdated();
        }

        var remove = () => {
            this._size--;
            var b: Block = this.blocks.pop();
            this.removeChild(b);
            this.blocksUpdated();
        }

        for (var i = 0; i < Math.abs(amount); i++) {
            if (amount > 0) {
                add();
            }
            else {
                remove();
            }
            if (!leavePosition) {
                this.y = (game.Game.height - game.Game.blockSize) - (this.size() * game.Game.blockSize);
            }
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
    public static pistonGraphic: HTMLImageElement;

    constructor() {
        super(Block.blockGraphic);
        this.scaleX = game.Game.blockSize / Block.blockGraphic.width;
        this.scaleY = game.Game.blockSize / Block.blockGraphic.height;
    }

    setImage(image:HTMLImageElement) {
        this.image = image;
    }
}