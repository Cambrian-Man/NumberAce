var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "game"], function(require, exports, __game__) {
    var game = __game__;

    var Board = (function (_super) {
        __extends(Board, _super);
        function Board(queue) {
                _super.call(this);
            Block.blockGraphic = queue.getResult("block");
            this.lines = [];
            for(var i = 0; i < 30; i++) {
                var height = Math.floor((Math.random() * 10)) + 1;
                this.addLine(height);
            }
        }
        Board.prototype.addLine = function (height) {
            var l = new Line(height);
            l.x = (game.Game.blockSize * 5) * this.lines.length;
            this.lines.push(l);
            this.addChild(l);
        };
        Board.prototype.getLine = function (column) {
            return this.lines[column];
        };
        return Board;
    })(createjs.Container);
    exports.Board = Board;    
    var Line = (function (_super) {
        __extends(Line, _super);
        function Line(height) {
                _super.call(this);
            this._size = 0;
            this.count = new createjs.Text("", Math.floor(game.Game.blockSize / 2) + "px Helvetica", "#FFF");
            this.count.x = game.Game.blockSize / 2;
            this.count.lineWidth = game.Game.blockSize;
            this.count.lineHeight = game.Game.blockSize;
            this.count.textAlign = "center";
            this.addChild(this.count);
            this.blocks = [];
            this.changeBlocks(height);
        }
        Line.prototype.changeBlocks = function (amount, animate, onComplete) {
            var _this = this;
            var add = function () {
                _this._size++;
                var b = new Block();
                b.y = _this.size() * game.Game.blockSize;
                _this.blocks.push(b);
                _this.addChild(b);
                _this.blocksUpdated();
            };
            var remove = function () {
                _this._size--;
                var b = _this.blocks.pop();
                _this.removeChild(b);
                _this.blocksUpdated();
            };
            var cycle = function (times) {
                if(times < Math.abs(amount)) {
                    if(amount > 0) {
                        add();
                    } else {
                        remove();
                    }
                    createjs.Tween.get(_this).to({
                        y: (game.Game.height - game.Game.blockSize) - (_this.size() * game.Game.blockSize)
                    }, 500, createjs.Ease.bounceOut).call(cycle, [
                        times + 1
                    ]);
                } else {
                    if(onComplete) {
                        onComplete();
                    }
                }
            };
            if(!animate) {
                for(var i = 0; i < Math.abs(amount); i++) {
                    if(amount > 0) {
                        add();
                    } else {
                        remove();
                    }
                    this.y = (game.Game.height - game.Game.blockSize) - (this.size() * game.Game.blockSize);
                }
            } else {
                cycle(0);
            }
        };
        Line.prototype.blocksUpdated = function () {
            this.removeChild(this.count);
            this.count.text = this.size().toString();
            this.count.y = this.blocks[0].y + (game.Game.blockSize / 5);
            this.addChild(this.count);
        };
        Line.prototype.size = function () {
            return this._size;
        };
        return Line;
    })(createjs.Container);
    exports.Line = Line;    
    var Block = (function (_super) {
        __extends(Block, _super);
        function Block() {
                _super.call(this, Block.blockGraphic);
            this.scaleX = game.Game.blockSize / Block.blockGraphic.width;
            this.scaleY = game.Game.blockSize / Block.blockGraphic.height;
        }
        return Block;
    })(createjs.Bitmap);    
})
//@ sourceMappingURL=board.js.map
