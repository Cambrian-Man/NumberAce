var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports"], function(require, exports) {
    
    
    var Stunt = (function () {
        function Stunt(from, to, callback) {
            this.from = from;
            this.to = to;
            this.callback = callback;
        }
        Stunt.prototype.go = function () {
            if(this.callback) {
                this.callback();
            }
        };
        Stunt.register = function register(stunt) {
        };
        return Stunt;
    })();
    exports.Stunt = Stunt;    
    var MovePlatform = (function (_super) {
        __extends(MovePlatform, _super);
        function MovePlatform() {
            _super.apply(this, arguments);

        }
        MovePlatform.prototype.go = function () {
        };
        return MovePlatform;
    })(Stunt);
    exports.MovePlatform = MovePlatform;    
})
//@ sourceMappingURL=stunts.js.map
