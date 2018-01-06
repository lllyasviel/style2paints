cc.Class({
    extends: cc.Component,

    properties: {
        A: {
            default: null, type: cc.Node
        },
        B: {
            default: null, type: cc.Node
        },
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        this.node.width = this.A.width - this.B.width;
     },
});
