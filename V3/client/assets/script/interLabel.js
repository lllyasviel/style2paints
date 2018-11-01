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
        },
    },

    chinese_shift: function () {
        this.getComponent('cc.Label').string = this.chinese;
    },

    english_shift: function () {
        this.getComponent('cc.Label').string = this.english;
    },

    japanese_shift: function () {
        this.getComponent('cc.Label').string = this.japanese;
    },

});
