var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "game", "control"], function(require, exports, __game__, __control__) {
    
    var game = __game__;

    var control = __control__;

    var Stunt = (function () {
        function Stunt(from, to, player, success, failure) {
            this.from = from;
            this.to = to;
            this.player = player;
            this.success = success;
            this.failure = failure;
        }
        Stunt.prototype.go = function () {
            throw "Need to override this";
        };
        return Stunt;
    })();
    exports.Stunt = Stunt;    
    var AddPlatform = (function (_super) {
        __extends(AddPlatform, _super);
        function AddPlatform() {
            _super.apply(this, arguments);

        }
        AddPlatform.prototype.go = function () {
            var _this = this;
            var g = new createjs.Graphics();
            g.beginFill("#000").rect(0, 0, this.to.x - (this.from.x + game.Game.blockSize), game.Game.blockSize);
            this.platform = new createjs.Shape(g);
            Stunt.board.addChild(this.platform);
            this.platform.x = this.from.x + game.Game.blockSize;
            this.platform.y = game.Game.height;
            createjs.Tween.get(this.platform).to({
                y: this.to.y + game.Game.blockSize
            }, 30 * this.to.size());
            var amount;
            (this.player.mode == control.Player.addMode) ? amount = this.player.power : amount = -this.player.power;
            this.shiftPlatform(amount, function () {
                if(_this.from.size() == _this.to.size()) {
                    _this.animateProgress();
                } else {
                    _this.failure();
                    Stunt.board.addChild(_this.platform);
                }
            });
        };
        AddPlatform.prototype.shiftPlatform = function (amount, callback) {
            var _this = this;
            var cycle = function (times) {
                if(times < Math.abs(amount)) {
                    if(amount > 0) {
                        _this.from.changeBlocks(1, true);
                    } else {
                        _this.from.changeBlocks(-1, true);
                    }
                    createjs.Tween.get(_this.from).to({
                        y: (game.Game.height - game.Game.blockSize) - (_this.from.size() * game.Game.blockSize)
                    }, 500, createjs.Ease.bounceOut).call(cycle, [
                        times + 1
                    ]);
                } else {
                    if(callback) {
                        callback();
                    }
                }
            };
            cycle(0);
        };
        AddPlatform.prototype.animateProgress = function () {
            var _this = this;
            var completed = function () {
                _this.player.ready = true;
                _this.success();
            };
            createjs.Tween.get(this.player).to({
                progress: this.to.x
            }, 500, createjs.Ease.sineInOut).call(function () {
                createjs.Tween.get(_this.platform).to({
                    y: game.Game.height + (game.Game.blockSize * 4),
                    rotation: 90
                }, 1000, createjs.Ease.getPowOut(2.5)).call(function () {
                    Stunt.board.removeChild(_this.platform);
                });
                completed();
            });
        };
        return AddPlatform;
    })(Stunt);
    exports.AddPlatform = AddPlatform;    
    var Pinball = (function (_super) {
        __extends(Pinball, _super);
        function Pinball() {
            _super.apply(this, arguments);

        }
        Pinball.prototype.go = function () {
            var amount;
            (this.player.mode == control.Player.addMode) ? amount = this.player.power : amount = -this.player.power;
            // This is subtract-only.
            if(amount > 0) {
                this.player.ready = true;
                return;
            }
            this.fly(amount);
        };
        Pinball.prototype.fly = function (amount) {
            var _this = this;
            var completed = function () {
                _this.player.ready = true;
                _this.success();
            };
            createjs.Tween.get(this.player).to({
                progress: this.to.x
            }, 200, createjs.Ease.bounceOut).call(function () {
                completed();
            });
            createjs.Tween.get(this.player.ball).to({
                y: this.to.y
            }, 100 * amount, createjs.Ease.sineOut);
        };
        return Pinball;
    })(Stunt);
    exports.Pinball = Pinball;    
})
//@ sourceMappingURL=stunts.js.map
