module.exports = function RandomCanvas(name){

    let self = Object();

    self.spriteFrame = new cc.SpriteFrame();
    self.texture2d = null;

    self.canvas = document.createElement("canvas");
    self.canvas.id = 'canvas_' + name;

    self.random_canvas = document.createElement("canvas");
    self.random_canvas.id = 'random_canvas_' + name;

    self.load_image = function (image, weight, height) {

        self.canvas.width = parseInt(weight);
        self.canvas.height = parseInt(height);

        let ctx = self.canvas.getContext('2d');

        ctx.drawImage(image, 0, 0, self.canvas.width, self.canvas.height);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        return self.spriteFrame;
    };

    self.randomize = function (weight, height) {
        let size = window.regulator.absRegulate([weight, height], 12);
        let patch_size = 48;

        self.random_canvas.width = parseInt(size[0] * patch_size);
        self.random_canvas.height = parseInt(size[1] * patch_size);

        let ctx = self.random_canvas.getContext('2d');

        ctx.fillStyle='rgba(0,0,0,0)';
        ctx.fillRect(0, 0, self.random_canvas.width, self.random_canvas.height);

        for(let x = 0; x < self.random_canvas.width; x+=patch_size){
            ctx.drawImage(self.canvas, parseInt(Math.random() * (self.canvas.width - patch_size)), parseInt(Math.random() * (self.canvas.height - patch_size)), patch_size, patch_size, x, 0, patch_size, patch_size);
        }

        for(let x = 0; x < self.random_canvas.width; x+=patch_size){
            ctx.drawImage(self.canvas, parseInt(Math.random() * (self.canvas.width - patch_size)), parseInt(Math.random() * (self.canvas.height - patch_size)), patch_size, patch_size, x, self.random_canvas.height - patch_size, patch_size, patch_size);
        }

        for(let y = 0; y < self.random_canvas.height; y+=patch_size){
            ctx.drawImage(self.canvas, parseInt(Math.random() * (self.canvas.width - patch_size)), parseInt(Math.random() * (self.canvas.height - patch_size)), patch_size, patch_size, 0, y, patch_size, patch_size);
        }

        for(let y = 0; y < self.random_canvas.height; y+=patch_size){
            ctx.drawImage(self.canvas, parseInt(Math.random() * (self.canvas.width - patch_size)), parseInt(Math.random() * (self.canvas.height - patch_size)), patch_size, patch_size, self.random_canvas.width - patch_size, y, patch_size, patch_size);
        }

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.random_canvas);
        self.texture2d.handleLoadedTexture(true);

    };

    return self;
};