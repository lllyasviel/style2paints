(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/subWidth.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '34a72PKo4VOC43DYAdYfNnu', 'subWidth', __filename);
// scripts/subWidth.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        A: {
            default: null, type: cc.Node
        },
        B: {
            default: null, type: cc.Node
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        this.node.width = this.A.width - this.B.width;
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
        //# sourceMappingURL=subWidth.js.map
        