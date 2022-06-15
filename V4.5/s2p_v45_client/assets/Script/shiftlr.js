cc.Class({
    extends: cc.Component,

    properties: {
        btn_show: {
            default: null, type: cc.Node
        },
        btn_hide: {
            default: null, type: cc.Node
        },
        btn_a: {
            default: null, type: cc.Node
        },
        btn_b: {
            default: null, type: cc.Node
        },
    },

    show: function() {
        this.btn_show.active = false;
        this.btn_hide.active = true;
        this.btn_a.active = true;
        this.btn_b.active = true;
    },

    hide: function() {
        this.btn_show.active = true;
        this.btn_hide.active = false;
        this.btn_a.active = false;
        this.btn_b.active = false;
    },


});
