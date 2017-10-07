(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/openURL.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '2d711SvFglI2LFM/wHKq2Rc', 'openURL', __filename);
// scripts/openURL.js

"use strict";

cc.Class({
    extends: cc.Component,
    properties: {
        url: {
            default: "", type: String
        }
    },
    onOpen: function onOpen() {
        window.open(this.url);
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
        //# sourceMappingURL=openURL.js.map
        