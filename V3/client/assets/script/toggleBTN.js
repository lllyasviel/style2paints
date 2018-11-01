cc.Class({
    extends: cc.Component,

    properties: {
        self: {
            default: null, type: cc.Button
        },
        other1: {
            default: null, type: cc.Button
        },
        other2: {
            default: null, type: cc.Button
        },
    },

    // called every frame, uncomment this function to activate update callback
    shifter: function () {
        this.self.interactable = false;
        this.other1.interactable = true;
        this.other2.interactable = true;
    },
});
