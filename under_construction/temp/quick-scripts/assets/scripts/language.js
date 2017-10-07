(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/language.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '43eed/FNLJL8abf9CYtrkGJ', 'language', __filename);
// scripts/language.js

"use strict";

cc.Class({
    extends: cc.Component,

    chinese: function chinese() {
        console.log("chinese");
        var tests = this.getComponentsInChildren("interLabel");
        for (var i = 0; i < tests.length; i++) {
            tests[i].chinese_shift();
        }
        tests = this.getComponentsInChildren("interLabelraw");
        for (var i = 0; i < tests.length; i++) {
            tests[i].chinese_shift();
        }
    },

    japanese: function japanese() {
        console.log("japanese");
        var tests = this.getComponentsInChildren("interLabel");
        for (var i = 0; i < tests.length; i++) {
            tests[i].japanese_shift();
        }
        tests = this.getComponentsInChildren("interLabelraw");
        for (var i = 0; i < tests.length; i++) {
            tests[i].japanese_shift();
        }
    },

    english: function english() {
        console.log("english");
        var tests = this.getComponentsInChildren("interLabel");
        for (var i = 0; i < tests.length; i++) {
            tests[i].english_shift();
        }
        tests = this.getComponentsInChildren("interLabelraw");
        for (var i = 0; i < tests.length; i++) {
            tests[i].english_shift();
        }
    },

    onLoad: function onLoad() {
        this.english();
        if (navigator.language.substring(0, 2) == "zh") {
            this.chinese();
        }
        if (navigator.language.substring(0, 2) == "ja") {
            this.japanese();
        }
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
        //# sourceMappingURL=language.js.map
        