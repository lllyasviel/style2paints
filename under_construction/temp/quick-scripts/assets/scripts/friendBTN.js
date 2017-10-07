(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/friendBTN.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '89bbbt2755B+KUc2xfqGh2x', 'friendBTN', __filename);
// scripts/friendBTN.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        self: {
            default: null, type: cc.Button
        },
        other: {
            default: null, type: cc.Button
        }
    },

    // called every frame, uncomment this function to activate update callback
    shifter: function shifter() {
        this.self.interactable = false;
        this.other.interactable = true;
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=friendBTN.js.map
        