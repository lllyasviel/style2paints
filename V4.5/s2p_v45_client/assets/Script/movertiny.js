cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {
        window.crop_dragger_A = this;
        self.spriteFrame = new cc.SpriteFrame();
        self.texture2d = null;
        window.cp_drager.push(this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.ontiii, this.node);
        this.ontiii(null);
    },

    start: function(){
        this.ontiii(null);
    },

    ontiii: function (event) {
        if(event!=null){
            var delta = event.touch.getDelta();
            this.x += delta.x;
            this.y += delta.y;
        }
        if(window.cp_drager.length < 4){
            return;
        }
        if(this.x < - window.cpNode.width / 2.0){
            this.x = - window.cpNode.width / 2.0;
        }
        if(this.x >  window.cpNode.width / 2.0){
            this.x =  window.cpNode.width / 2.0;
        }
        if(this.y < - window.cpNode.height / 2.0){
            this.y = - window.cpNode.height / 2.0;
        }
        if(this.y >  window.cpNode.height / 2.0){
            this.y =  window.cpNode.height / 2.0;
        }
        window.sketch_crop_l = 0.5 + (Math.min(window.cp_drager[0].x, window.cp_drager[1].x, window.cp_drager[2].x, window.cp_drager[3].x) * 1.0) / (window.cpNode.width * 1.0);
        window.sketch_crop_r = 0.5 + (Math.max(window.cp_drager[0].x, window.cp_drager[1].x, window.cp_drager[2].x, window.cp_drager[3].x) * 1.0) / (window.cpNode.width * 1.0);
        window.sketch_crop_d = 0.5 + (Math.min(window.cp_drager[0].y, window.cp_drager[1].y, window.cp_drager[2].y, window.cp_drager[3].y) * 1.0) / (window.cpNode.height * 1.0);
        window.sketch_crop_u = 0.5 + (Math.max(window.cp_drager[0].y, window.cp_drager[1].y, window.cp_drager[2].y, window.cp_drager[3].y) * 1.0) / (window.cpNode.height * 1.0);
        window.sketch_crop_l *= window.cropImageCanvas.canvas.width;
        window.sketch_crop_r *= window.cropImageCanvas.canvas.width;
        window.sketch_crop_d *= window.cropImageCanvas.canvas.height;
        window.sketch_crop_u *= window.cropImageCanvas.canvas.height;
        window.sketch_crop_w = window.sketch_crop_r - window.sketch_crop_l;
        window.sketch_crop_h = window.sketch_crop_u - window.sketch_crop_d;
        window.controller.real_fileBtnNode.active = true;
        if(window.sketch_crop_w > window.sketch_crop_h * 2.6){
            window.controller.real_fileBtnNode.active = false;
        }
        if(window.sketch_crop_h > window.sketch_crop_w * 2.6){
            window.controller.real_fileBtnNode.active = false;
        }
        self.canvas = window.cropMaskCanvas.canvas;
        self.canvas.width = window.cropImageCanvas.canvas.width;
        self.canvas.height = window.cropImageCanvas.canvas.height;

        let ctx = self.canvas.getContext('2d');
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        let w = parseInt(window.sketch_crop_w);
        let h = parseInt(window.sketch_crop_h);
        let x = parseInt(window.sketch_crop_l);
        let y = parseInt(window.cropImageCanvas.canvas.height - window.sketch_crop_u);
        ctx.clearRect(x, y, w, h);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);
        window.cpNode2Sprite.spriteFrame = self.spriteFrame;
    },

    update: function (dt) {

    },
});
