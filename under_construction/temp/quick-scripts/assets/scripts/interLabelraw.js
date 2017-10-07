(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/interLabelraw.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '3022cUZjkhO6Kb/VeKpEDgk', 'interLabelraw', __filename);
// scripts/interLabelraw.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        chinese: {
            default: "", type: cc.String, multiline: true
        },
        japanese: {
            default: "", type: cc.String, multiline: true
        },
        english: {
            default: "", type: cc.String, multiline: true
        }
    },

    chinese_shift: function chinese_shift() {
        this.getComponent('cc.Label').string = this.chinese;
    },

    english_shift: function english_shift() {
        this.getComponent('cc.Label').string = this.english;
    },

    japanese_shift: function japanese_shift() {
        this.getComponent('cc.Label').string = this.japanese;
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
        //# sourceMappingURL=interLabelraw.js.map
        