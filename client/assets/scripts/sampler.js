cc.Class({
    extends: cc.Component,

    properties: {
        URLID: {
            default: "", type: cc.String
        },
        sketchDenoise: {
            default: "", type: cc.String
        },
        resultDenoise: {
            default: "", type: cc.String
        },
        method: {
            default: "", type: cc.String
        },
        algrithom: {
            default: "", type: cc.String
        },
        hasRef: {
            default: true, type: cc.Boolean
        },
    }

});
