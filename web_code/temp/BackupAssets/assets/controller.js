cc.Class({
    extends: cc.Component,

    properties: {
        sp: cc.Sprite
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function () {
        var url = "https://paintschainer-cdn.preferred.tech/images/paintschainer-64x64.png";
        var spr = new cc.Sprite(url);
        
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
