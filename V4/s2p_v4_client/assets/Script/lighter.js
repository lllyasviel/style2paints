cc.Class({
    extends: cc.Component,

    properties: {
        light_R_slider: {
            default: null, type: cc.Slider
        },
        light_G_slider: {
            default: null, type: cc.Slider
        },
        light_B_slider: {
            default: null, type: cc.Slider
        },
        light_H_slider: {
            default: null, type: cc.Slider
        },
        light_TT_slider: {
            default: null, type: cc.Toggle
        },
        light_TF_slider: {
            default: null, type: cc.Toggle
        },
        light_FT_slider: {
            default: null, type: cc.Toggle
        },
        light_FF_slider: {
            default: null, type: cc.Toggle
        },
        bgs: {
            default: null, type: cc.Node
        },
    },

    onLoad(){
        window.lighter = this;
    },

    start () {
        this.light_R_slider.progress = 0.99;
        this.light_G_slider.progress = 0.83;
        this.light_B_slider.progress = 0.66;
        this.light_H_slider.progress = 100.0 / 600.0;
        window.lighter = this;
        window.light_direction = 0;
        this.reflush();
    },

    light_direction_0: function () {
        window.light_direction = 0;
    },

    light_direction_1: function () {
        window.light_direction = 1;
    },

    light_direction_2: function () {
        window.light_direction = 2;
    },

    light_direction_3: function () {
        window.light_direction = 3;
    },

    reflush: function () {
        this.bgs.color = cc.color(parseInt(this.light_R_slider.progress * 255.0), parseInt(this.light_G_slider.progress * 255.0), parseInt(this.light_B_slider.progress * 255.0), 255); 
    },

});
