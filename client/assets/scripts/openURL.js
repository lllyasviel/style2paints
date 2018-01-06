cc.Class({
    extends: cc.Component,
    properties: {
        url:{
            default:"",type:String
        },
    },
    onOpen: function () {
        window.open(this.url);
    },
});
