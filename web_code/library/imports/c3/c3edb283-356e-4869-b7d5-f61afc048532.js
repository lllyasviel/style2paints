"use strict";
cc._RF.push(module, 'c3edbKDNW5IabfV9hr8BIUy', 'openURL');
// script/openURL.js

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