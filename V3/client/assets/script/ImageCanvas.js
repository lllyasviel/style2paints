module.exports = function ImageCanvas(name){

    let self = Object();

    self.spriteFrame = new cc.SpriteFrame();
    self.texture2d = null;

    self.source = null;

    self.canvas = document.createElement("canvas");
    self.canvas.id = 'canvas_' + name;

    self.load_image = function (image, weight, height) {

        self.canvas.width = parseInt(weight);
        self.canvas.height = parseInt(height);

        let ctx = self.canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, self.canvas.width, self.canvas.height);

        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

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

    self.get_color_adapted = function (x, y) {

        return self.get_color(x, y);

        // if(self.source==null){
        //     return new cc.color(255, 255, 255);
        // }
        //
        // let idx = 0;
        //
        // idx = parseInt((1 - y) * self.canvas.height);
        // idx = parseInt(idx * self.canvas.width);
        // idx = parseInt(idx + x * self.canvas.width);
        // idx = parseInt(idx * 4);
        //
        // let r = self.source.data[idx];
        // let g = self.source.data[idx + 1];
        // let b = self.source.data[idx + 2];
        // let l = 0.299 * r + 0.587 * g + 0.114 * b;
        //
        // r = r * 0.8 + l * 0.2;
        // g = g * 0.8 + l * 0.2;
        // b = b * 0.8 + l * 0.2;
        //
        // return new cc.color(parseInt(r), parseInt(g), parseInt(b));

    };

    return self;
};