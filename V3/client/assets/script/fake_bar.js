cc.Class({
    extends: cc.Component,

    properties: {
        bar: {
            default: null,
            type: cc.ProgressBar
        },
        lab: {
            default: null,
            type: cc.Label
        },
    },

    change: function(name, x=0){
        this.bar.progress = x;
        this.lab.string = name;
    },

    update (dt) {
        let t = this.bar.progress;
        t += 0.005;
        if(t > 1){
            t = 1;
        }
        this.bar.progress = t;
    },
});
