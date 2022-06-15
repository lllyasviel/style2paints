cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad: function () {
        window.eraser_masker = this.node;
    },

    update (dt) {
        this.node.x = window.mousePosition.x - cc.winSize.width / 2;
        this.node.y = window.mousePosition.y - cc.winSize.height / 2;
    },

});
