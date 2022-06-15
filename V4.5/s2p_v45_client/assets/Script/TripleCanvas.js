module.exports = function ImageCanvas(name){

    let self = Object();

    self.spriteFrame = new cc.SpriteFrame();
    self.texture2d = null;

    self.spriteFrame_p = new cc.SpriteFrame();
    self.texture2d_p = null;

    self.source = null;
    self.source_light = null;
    self.source_color = null;

    self.canvas_light = document.createElement("canvas");
    self.canvas_light.id = 'canvas_light' + name;

    self.canvas_color = document.createElement("canvas");
    self.canvas_color.id = 'canvas_color' + name;

    self.canvas_shade = document.createElement("canvas");
    self.canvas_shade.id = 'canvas_shade' + name;

    self.load_local = function(){

        self.canvas = window.previewImageCanvas.canvas;

        let weight = self.canvas.width;
        let height = self.canvas.height;

        if(window.hasColor){
            self.canvas_light.width = parseInt(weight);
            self.canvas_light.height = parseInt(height);
            self.canvas_color.width = parseInt(weight);
            self.canvas_color.height = parseInt(height);
            let ctx = self.canvas.getContext('2d');
            self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
            self.source_light = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
            self.source_color = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
            for(let y=0; y < height; y++){
                for(let x=0; x < weight; x++){
                    let idr = (x + y * weight) * 4;
                    let idg = idr + 1;
                    let idb = idr + 2;
                    let ida = idr + 3;
    
                    let r = self.source.data[idr];
                    let g = self.source.data[idg];
                    let b = self.source.data[idb];
                    let a = self.source.data[ida];
                    let m = Math.max(r, g, b);
    
                    self.source_light.data[idr] = m;
                    self.source_light.data[idg] = m;
                    self.source_light.data[idb] = m;
                    self.source_light.data[ida] = 255;
    
                    if(m < 15){
                        r = m;
                        g = m;
                        b = m;
                    }
    
                    self.source_color.data[idr] = parseInt((r * 1.0 + 0.0001) / (m * 1.0 + 0.0001) * 255.0);
                    self.source_color.data[idg] = parseInt((g * 1.0 + 0.0001) / (m * 1.0 + 0.0001) * 255.0);
                    self.source_color.data[idb] = parseInt((b * 1.0 + 0.0001) / (m * 1.0 + 0.0001) * 255.0);
                    self.source_color.data[ida] = 255;
    
                }
            }
            self.canvas_light.getContext('2d').putImageData(self.source_light, 0, 0);
            self.canvas_color.getContext('2d').putImageData(self.source_color, 0, 0);

            if(window.hasRender){
                self.canvas_shade.width = parseInt(weight);
                self.canvas_shade.height = parseInt(height);
                self.source = self.canvas_shade.getContext('2d').getImageData(0, 0, self.canvas.width, self.canvas.height);
                self.source_from = window.previewImageCanvas.canvas.getContext('2d').getImageData(0, 0, self.canvas.width, self.canvas.height);
                self.source_to = window.renderImageCanvas.canvas.getContext('2d').getImageData(0, 0, self.canvas.width, self.canvas.height);
        
                for(let y=0; y < height; y++){
                    for(let x=0; x < weight; x++){
                        let idr = (x + y * weight) * 4;
                        let idg = idr + 1;
                        let idb = idr + 2;
                        let ida = idr + 3;
        
                        let rf = self.source_from.data[idr];
                        let gf = self.source_from.data[idg];
                        let bf = self.source_from.data[idb];
        
                        let rt = self.source_to.data[idr];
                        let gt = self.source_to.data[idg];
                        let bt = self.source_to.data[idb];
        
                        let ri = (rt * 1.0 + 0.0001) / (rf * 1.0 + 0.0001) * 255.0;
                        let gi = (gt * 1.0 + 0.0001) / (gf * 1.0 + 0.0001) * 255.0;
                        let bi = (bt * 1.0 + 0.0001) / (bf * 1.0 + 0.0001) * 255.0;
        
                        if (ri > 255) ri = 255;
                        if (gi > 255) gi = 255;
                        if (bi > 255) bi = 255;
        
                        self.source.data[idr] = parseInt(ri);
                        self.source.data[idg] = parseInt(gi);
                        self.source.data[idb] = parseInt(bi);
                        self.source.data[ida] = 255;
        
                    }
                }
        
                self.canvas_shade.getContext('2d').putImageData(self.source, 0, 0);
            }
        }

    };

    return self;
};