cc.Class({
    extends: cc.Component,

    properties: {
        lab: {
            default: null,
            type: cc.Label
        },
        lab2: {
            default: null,
            type: cc.Label
        },
        prof: {
            default: null, type: cc.Node
        },
        prob: {
            default: null, type: cc.Node
        },
    },

    onLoad: function () {
        window.fake_bar_pro = this;
        this.text = 'finished';
        this.progress = 1.0;
    },

    change: function(name, x=0){
        this.text = name;
        this.progress = x;
    },

    update (dt) {
        this.progress += (1 - this.progress) * 0.005;
        if(this.progress > 1){
            this.progress = 1;
        }
        this.lab.string = this.text + " (" + parseInt(this.progress * 100) + "%)";
        this.lab2.string = this.lab.string;
        this.prof.width = parseInt(this.prob.width * this.progress);
        this.prob.active=(this.progress < 1);
    },
});
