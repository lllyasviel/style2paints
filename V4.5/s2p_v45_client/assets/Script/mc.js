cc.Class({
    extends: cc.Component,

    properties: {
        c0: {
            default: null, type: cc.Sprite
        },
        c1: {
            default: null, type: cc.Sprite
        },
        c2: {
            default: null, type: cc.Sprite
        },
        c3: {
            default: null, type: cc.Sprite
        },
        c4: {
            default: null, type: cc.Sprite
        },
        c5: {
            default: null, type: cc.Sprite
        },
        c6: {
            default: null, type: cc.Sprite
        },
        c7: {
            default: null, type: cc.Sprite
        },
        c8: {
            default: null, type: cc.Sprite
        },
        kuang: {
            default: null, type: cc.Sprite
        }
    },

    onLoad(){
        window.minecraft = this;
    },

    start () {
        this.sps = [this.c0, this.c1, this.c2, this.c3, this.c4, this.c5, this.c6, this.c7, this.c8]
        window.minecraft = this;
        this.big9 = [[255,255,255], [255,230,200], [137,148,170],[150,164,141],[229,202,209],[249,233,218],[0, 233, 1],[1, 233, 0],[154,81,255]];
        this.reload_all();
        this.index = 4;
        this.set_index(0);
        window.in_color = true;
        this.shift();
        setTimeout("window.pickCanvas.record=window.pickCanvas.bigall;window.pickCanvas.finish();", 200);
    },

    set_0: function(){this.set_index(0);},
    set_1: function(){this.set_index(1);},
    set_2: function(){this.set_index(2);},
    set_3: function(){this.set_index(3);},
    set_4: function(){this.set_index(4);},
    set_5: function(){this.set_index(5);},
    set_6: function(){this.set_index(6);},
    set_7: function(){this.set_index(7);},
    set_8: function(){this.set_index(8);},

    refresh: function(){
        for(let i=0; i < 9; i ++){
            this.set_color(i, [0, 0, 0]);
        }
        setTimeout("window.minecraft.reload_all();window.minecraft.set_index(window.minecraft.index);", 100);
    },

    reload_all: function(){
        for(let i=0; i < 9; i ++){
            this.set_color(i, this.big9[i]);
        }
    },

    set_index: function(x){
        if(x == -233){
            this.index = x;
            this.kuang.node.active = false;
            return;
        }else{
            this.kuang.node.active = true;
        }
        if(x < 0) x = 0;
        if(x > 8) x = 8;
        this.index = x;
        this.kuang.node.x = -400 + 100 * x;
        if(this.index > -1 && this.index < 5){
            window.pickCanvas.floatingColor[0] = this.sps[this.index].node.color.r;
            window.pickCanvas.floatingColor[1] = this.sps[this.index].node.color.g;
            window.pickCanvas.floatingColor[2] = this.sps[this.index].node.color.b;
            window.color_picker_main.pick_float();
            window.isPen = true;
            window.in_move = false;
            window.eraser_masker.active = false;
        }
        if(this.index == 5){
            window.isPen = true;
            window.in_move = false;
            window.eraser_masker.active = false;
        }
        if(this.index == 6){
            window.isPen = true;
            window.in_move = false;
            window.eraser_masker.active = false;
        }
        if(this.index == 7){
            window.isPen = true;
            window.in_move = true;
            window.eraser_masker.active = false;
        }
        if(this.index == 8){
            window.isPen = false;
            window.in_move = false;
            window.eraser_masker.active = true;
        }
    },

    set_color: function(x, c){
        if(x > -1 && x < 5){
            this.sps[x].node.color = cc.color(c[0],c[1],c[2],255); 
        }
    },

    shift: function(){
        for(let i=0; i < 5; i ++){
            this.sps[i].node.active = window.in_color;
        }
        for(let i=5; i < 7; i ++){
            this.sps[i].node.active = !window.in_color;
        }
        if(this.index == 7 || this.index == 8){
            return;
        }
        if(window.in_color){
            if(this.index > 4){
                this.set_index(0);
            }
        }
        if(!window.in_color){
            if(this.index < 5){
                this.set_index(5);
            }
        }
    },

    go_pen: function(){
        if(this.index == 5 || this.index == 6 || this.index == 7 || this.index == 8){
            this.index = 0;
            this.kuang.node.x = -400;
        }
    },

    set_cur_color: function(c){
        if(this.index > -1 && this.index < 5){
            this.sps[this.index].node.color = cc.color(c[0],c[1],c[2],255); 
        }
    },

});
