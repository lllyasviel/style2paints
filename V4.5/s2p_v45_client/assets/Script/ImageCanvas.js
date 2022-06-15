module.exports = function ImageCanvas(name){

    let self = Object();

    self.spriteFrame = new cc.SpriteFrame();
    self.texture2d = null;

    self.source = null;

    self.canvas = document.createElement("canvas");
    self.canvas.id = 'canvas_' + name;

    self.image = null;

    self.load_image = function (image, weight, height) {

        self.image = image;

        self.canvas.width = parseInt(weight);
        self.canvas.height = parseInt(height);

        let ctx = self.canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, self.canvas.width, self.canvas.height);

        self.dataurl = self.canvas.toDataURL("image/png");

        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        return self.spriteFrame;
    };

    self.load_image_adv = function (image, x, y, weight, height) {

        self.image = image;

        if(parseInt(weight) > 1024 && parseInt(height) > 1024){
            let s1024 = window.regulator.minRegulate([parseInt(weight), parseInt(height)], 1024);
            self.canvas.width = s1024[0];
            self.canvas.height = s1024[1];
        }else{
            self.canvas.width = parseInt(weight);
            self.canvas.height = parseInt(height);
        }

        let ctx = self.canvas.getContext('2d');

        ctx.drawImage(image, x, y, parseInt(weight), parseInt(height), 0, 0, self.canvas.width, self.canvas.height);

        self.dataurl = self.canvas.toDataURL("image/png");

        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        return self.spriteFrame;
    };

    self.load_canvas = function (f_canvas) {

        self.canvas.width = f_canvas.width;
        self.canvas.height = f_canvas.height;

        let ctx = self.canvas.getContext('2d');

        ctx.drawImage(f_canvas, 0, 0, self.canvas.width, self.canvas.height);
        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        return self.spriteFrame;
    };

    self.clear = function () {

        self.canvas.width = 100;
        self.canvas.height = 100;

        let ctx = self.canvas.getContext('2d');

        ctx.clearRect(0, 0, 100, 100); 

        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        return self.spriteFrame;
    };

    self.dark = function () {

        self.canvas.width = 100;
        self.canvas.height = 100;

        let ctx = self.canvas.getContext('2d');

        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(0, 0, 100, 100);

        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        return self.spriteFrame;
    };

    self.load_alpha = function () {
        let ctx = self.canvas.getContext('2d');
        self.dataurl = self.canvas.toDataURL("image/png");
        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
        for(let y=0; y < self.canvas.height; y++){
            for(let x=0; x < self.canvas.width; x++){
                let idr = (x + y * self.canvas.width) * 4;
                let idg = idr + 1;
                let idb = idr + 2;
                let ida = idr + 3;
                let r = self.source.data[idr];
                let g = self.source.data[idg];
                let b = self.source.data[idb];
                let a = self.source.data[ida];
                let m = Math.max((r * 1.0 + g * 1.0 + b * 1.0) / 3.0, 255 - a);
                self.source.data[idr] = 0;
                self.source.data[idg] = 0;
                self.source.data[idb] = 0;
                self.source.data[ida] = 255 - m;
            }
        }
        ctx.putImageData(self.source, 0, 0);
        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);
        return self.spriteFrame;
    };

    self.get_color = function (x, y) {

        if(self.source==null){
            return new cc.color(255, 255, 255);
        }

        let idx = 0;

        idx = parseInt((1 - y) * self.canvas.height);
        idx = parseInt(idx * self.canvas.width);
        idx = parseInt(idx + x * self.canvas.width);
        idx = parseInt(idx * 4);

        return new cc.color(self.source.data[idx], self.source.data[idx + 1], self.source.data[idx + 2]);
    };

    return self;
};