(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/interLabel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a8741dMb/5JTYqaaFU1+v7G', 'interLabel', __filename);
// scripts/interLabel.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        chinese: {
            default: "", type: cc.String
        },
        japanese: {
            default: "", type: cc.String
        },
        english: {
            default: "", type: cc.String
        }
    },

    chinese_shift: function chinese_shift() {
        this.getComponent('cc.RichText').string = this.chinese;
    },

    english_shift: function english_shift() {
        this.getComponent('cc.RichText').string = this.english;
    },

    japanese_shift: function japanese_shift() {
        this.getComponent('cc.RichText').string = this.japanese;
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
        //# sourceMappingURL=interLabel.js.map
        