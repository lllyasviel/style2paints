cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        window.shifter_50 = this;
    },

    up50: function() {
        this.node.x = 50;
    },

    down50: function() {
        this.node.x = -50;
    },


});
