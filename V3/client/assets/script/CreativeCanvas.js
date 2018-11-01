module.exports = (function CreativeCanvas(name){

    let self = Object();

    self.spriteFrame = new cc.SpriteFrame();
    self.texture2d = null;

    self.gird_spriteFrame = new cc.SpriteFrame();
    self.gird_texture2d = null;

    self.canvas = document.createElement("canvas");
    self.canvas.id = 'canvas_' + name;

    self.gird_canvas = document.createElement("canvas");
    self.gird_canvas.id = 'gird_canvas_' + name;

    self.latent_canvas = document.createElement("canvas");
    self.latent_canvas.id = 'latent_canvas_' + name;

    self.current_index = 0;

    self.points_XYRGBR = [];
    self.cache = [];

    self.in_drag = false;
    self.in_paint = false;
    self.in_erase = false;

    self.finalData = null;

    self.add_log = function(){
        let points_XYRGBR_clone = [];
        for(let point of self.points_XYRGBR){
            let point_clone = [];
            for(let x of point){
                point_clone.push(x);
            }
            points_XYRGBR_clone.push(point_clone);
        }
        self.cache.push(points_XYRGBR_clone);
    };

    self.undo = function(){
        if(self.cache.length > 0){
            let item = self.cache.pop();
            self.points_XYRGBR = item;
            self.finish();
        }
    };

    self.clear_points = function(){
        self.points_XYRGBR = [];
    };

    self.add_point = function(x, y, r, g, b, l){
        self.points_XYRGBR.push([x, y, r, g, b, l]);
        self.current_index = self.points_XYRGBR.length - 1;
    };

    self.refresh_current_point_index = function(k){
        self.current_index = -1;
        for(let i in self.points_XYRGBR){
            let dx = (self.points_XYRGBR[i][0] - window.mouseRelativeX) * window.sketchL2Node.width;
            let dy = (self.points_XYRGBR[i][1] - window.mouseRelativeY) * window.sketchL2Node.height;
            let dd = (3 - self.points_XYRGBR[i][5]) * 4 * k;
            if (dx * dx + dy * dy < dd * dd){
                self.current_index = i;
            }
        }
    };

    self.finish = function () {

        let ctx = self.canvas.getContext('2d');
        let gird_ctx = self.gird_canvas.getContext('2d');

        let size = window.regulator.absRegulate([window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height], 512);
        self.canvas.width = size[0];
        self.canvas.height = size[1];
        ctx.drawImage(self.latent_canvas, 0, 0, self.latent_canvas.width, self.latent_canvas.height, 0, 0, self.canvas.width, self.canvas.height);
        self.finalData = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

        for(let item of self.points_XYRGBR){
            let xc = parseInt(item[0] * self.finalData.width);
            let yc = parseInt((1 - item[1]) * self.finalData.height);
            let r = item[2];
            let g = item[3];
            let b = item[4];
            let l = 24;
            if(item[5]!=2) continue;
            for(let x = xc - l; x <= xc + l; x++){
                if(x>=0 && x<self.finalData.width){
                    for(let y = yc - l; y <= yc + l; y++){
                        if(y>=0 && y<self.finalData.height){
                            let idx = parseInt((self.finalData.width * y + x) * 4);
                            let earth_distance = Math.sqrt((x - xc) * (x - xc) +(y - yc) * (y - yc)) / l;
                            // let color_distance = self.calculate_color_distance(r, g, b, self.finalData.data[idx], self.finalData.data[idx + 1], self.finalData.data[idx + 2]);
                            let factor = Math.pow(1 - earth_distance, 1.5);
                            if (isNaN(factor)){
                                factor = 0;
                            }
                            self.finalData.data[idx] = r * factor + (1 - factor) * self.finalData.data[idx];
                            self.finalData.data[idx + 1] = g * factor + (1 - factor) * self.finalData.data[idx + 1];
                            self.finalData.data[idx + 2] = b * factor + (1 - factor) * self.finalData.data[idx + 2];
                            self.finalData.data[idx + 3] = 255;
                        }
                    }
                }
            }
        }

        ctx.putImageData(self.finalData, 0, 0);

        self.gird_canvas.width = parseInt(self.canvas.width);
        self.gird_canvas.height = parseInt(self.canvas.height);
        gird_ctx.fillStyle='rgba(0,0,0,0)';
        gird_ctx.fillRect(0, 0, self.gird_canvas.width, self.gird_canvas.height);

        let xysize = window.regulator.absRegulate([window.sketchImageCanvas.canvas.width, window.sketchImageCanvas.canvas.height], 7);

        let xstep = parseInt(self.gird_canvas.width / (2 * xysize[0]));
        for(let x = xstep; x < self.gird_canvas.width; x+=xstep*2){
            gird_ctx.putImageData(ctx.getImageData(x-1, 0, 3, self.canvas.height), x-1, 0);
        }

        let ystep = parseInt(self.gird_canvas.height / (2 * xysize[1]));
        for(let y = ystep; y < self.gird_canvas.height; y+=ystep*2){
            gird_ctx.putImageData(ctx.getImageData(0, y-1, self.canvas.width, 3), 0, y-1);
        }

        let make_cycle = function (ctx, x, y, l, r, g, b, w) {
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(' + (r).toString() + ',' + (g).toString() + ',' + (b).toString() + ',1.0)';
            ctx.lineWidth = w;
            ctx.arc(x, y, l, 0, Math.PI*2);
            ctx.stroke();
            ctx.closePath();
        };

        let make_cross = function (ctx, x, y, l, r, g, b, w) {
            ctx.beginPath();

            ctx.strokeStyle = 'rgba(' + (r).toString() + ',' + (g).toString() + ',' + (b).toString() + ',1.0)';
            ctx.lineWidth = w + 4;
            ctx.moveTo(x - l, y);
            ctx.lineTo(x + l, y);
            ctx.moveTo(x, y - l);
            ctx.lineTo(x, y + l);
            ctx.stroke();

            ctx.strokeStyle = 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)';
            ctx.lineWidth = w;
            ctx.moveTo(x - l, y);
            ctx.lineTo(x + l, y);
            ctx.moveTo(x, y - l);
            ctx.lineTo(x, y + l);
            ctx.stroke();

            ctx.closePath();
        };

        let get_sorted_items = function (item) {

            let result = [];
            for(let x in self.points_XYRGBR){
                if(self.points_XYRGBR[x][5]==0) result.push(x);
            }

            let xc = item[0];
            let yc = item[1];

            let cal = function (i) {
                let xd = self.points_XYRGBR[i][0];
                let yd = self.points_XYRGBR[i][1];
                let l  = (xc - xd) * (xc - xd) +(yc - yd) * (yc - yd);
                if(l == 0) l = 65535458;
                return l
            };

            for(let i=0;i<result.length-1;i++){
                for(let j=0;j<result.length-1-i;j++){
                    if(cal(result[j])>cal(result[j+1])){
                        let temp=result[j];
                        result[j]=result[j+1];
                        result[j+1]=temp;
                    }
                }
            }

            return result;
        };

        for(let item of self.points_XYRGBR){

            let xc = parseInt(item[0] * self.gird_canvas.width);
            let yc = parseInt((1 - item[1]) * self.gird_canvas.height);
            let r = item[2];
            let g = item[3];
            let b = item[4];
            if(item[5]==0){

                let ll = 65535;

                let indexes = get_sorted_items(item);

                for(let cxx in indexes){
                    if(cxx>2) break;
                    let item2 = self.points_XYRGBR[indexes[cxx]];
                    let xc2 = parseInt(item2[0] * self.gird_canvas.width);
                    let yc2 = parseInt((1 - item2[1]) * self.gird_canvas.height);
                    let r2 = item2[2];
                    let g2 = item2[3];
                    let b2 = item2[4];
                    if(item2[5]==0){
                        ctx.beginPath();

                        let gradient_n = ctx.createLinearGradient(xc, yc, xc2, yc2);
                        gradient_n.addColorStop(0, 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)');
                        gradient_n.addColorStop(1, 'rgba(' + (255 - r2).toString() + ',' + (255 - g2).toString() + ',' + (255 - b2).toString() + ',1.0)');

                        let gradient_y = ctx.createLinearGradient(xc, yc, xc2, yc2);
                        gradient_y.addColorStop(0, 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ',1.0)');
                        gradient_y.addColorStop(1, 'rgba(' + r2.toString() + ',' + g2.toString() + ',' + b2.toString() + ',1.0)');

                        ctx.strokeStyle = gradient_y;
                        ctx.lineWidth = 5.0;
                        ctx.moveTo(xc, yc);
                        ctx.lineTo(xc2, yc2);
                        ctx.stroke();

                        ctx.strokeStyle = gradient_n;
                        ctx.lineWidth = 1.0;
                        ctx.moveTo(xc, yc);
                        ctx.lineTo(xc2, yc2);
                        ctx.stroke();

                        ctx.closePath();

                        let llm = Math.sqrt((xc - xc2) * (xc - xc2) +(yc - yc2) * (yc - yc2));

                        if(llm >0 && llm < ll){
                            ll = llm;
                        }

                    }
                }

                if(ll == 65535){
                    ll = 256;
                }else{
                    ll = ll /2;
                }

                make_cross(gird_ctx, xc, yc, ll, r, g, b, 1);

                make_cycle(gird_ctx, xc, yc, ll, r, g, b, 5);
                make_cycle(gird_ctx, xc, yc, ll, 255 - r, 255 - g, 255 - b, 1);

                make_cycle(ctx, xc, yc, ll, r, g, b, 5);
                make_cycle(ctx, xc, yc, ll, 255 - r, 255 - g, 255 - b, 1);

            }
        }

        for(let item of self.points_XYRGBR){

            let xc = parseInt(item[0] * self.gird_canvas.width);
            let yc = parseInt((1 - item[1]) * self.gird_canvas.height);
            let r = item[2];
            let g = item[3];
            let b = item[4];

            if(item[5]==0){

                gird_ctx.strokeStyle = 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)';
                gird_ctx.fillStyle = 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ',1.0)';
                gird_ctx.beginPath();
                gird_ctx.moveTo(xc - 10, yc);
                gird_ctx.lineTo(xc, yc - 10);
                gird_ctx.lineTo(xc + 10, yc);
                gird_ctx.lineTo(xc, yc + 10);
                gird_ctx.closePath();
                gird_ctx.fill();
                gird_ctx.stroke();

                ctx.strokeStyle = 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)';
                ctx.fillStyle = 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ',1.0)';
                ctx.beginPath();
                ctx.moveTo(xc - 10, yc);
                ctx.lineTo(xc, yc - 10);
                ctx.lineTo(xc + 10, yc);
                ctx.lineTo(xc, yc + 10);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }

        for(let item of self.points_XYRGBR){
            let xc = parseInt(item[0] * self.gird_canvas.width);
            let yc = parseInt((1 - item[1]) * self.gird_canvas.height);
            let r = item[2];
            let g = item[3];
            let b = item[4];
            if(item[5]==1){
                gird_ctx.strokeStyle = 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)';
                gird_ctx.fillStyle = 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ',1.0)';
                gird_ctx.beginPath();
                gird_ctx.moveTo(xc - 10, yc);
                gird_ctx.lineTo(xc, yc - 10);
                gird_ctx.lineTo(xc + 10, yc);
                gird_ctx.lineTo(xc, yc + 10);
                gird_ctx.closePath();
                gird_ctx.fill();
                gird_ctx.stroke();
                ctx.strokeStyle = 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)';
                ctx.fillStyle = 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ',1.0)';
                ctx.beginPath();
                ctx.moveTo(xc - 10, yc);
                ctx.lineTo(xc, yc - 10);
                ctx.lineTo(xc + 10, yc);
                ctx.lineTo(xc, yc + 10);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }

        for(let item of self.points_XYRGBR){
            let xc = parseInt(item[0] * self.gird_canvas.width);
            let yc = parseInt((1 - item[1]) * self.gird_canvas.height);
            let r = item[2];
            let g = item[3];
            let b = item[4];
            if(item[5]==2){
                gird_ctx.strokeStyle = 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)';
                gird_ctx.fillStyle = 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ',1.0)';
                gird_ctx.beginPath();
                gird_ctx.arc(xc,yc,6,0,Math.PI*2);
                gird_ctx.closePath();
                gird_ctx.fill();
                gird_ctx.stroke();
                ctx.strokeStyle = 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)';
                ctx.fillStyle = 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ',1.0)';
                ctx.beginPath();
                ctx.arc(xc,yc,6,0,Math.PI*2);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        self.gird_texture2d = new cc.Texture2D();
        self.gird_spriteFrame.setTexture(self.gird_texture2d);
        self.gird_texture2d.initWithElement(self.gird_canvas);
        self.gird_texture2d.handleLoadedTexture(true);
    };

    self.get_color = function (x, y) {

        if(self.finalData==null){
            return new cc.color(255, 255, 255);
        }

        let idx = 0;

        idx = parseInt((1 - y) * self.finalData.height);
        idx = parseInt(idx * self.finalData.width);
        idx = parseInt(idx + x * self.finalData.width);
        idx = parseInt(idx * 4);

        return new cc.color(self.finalData.data[idx], self.finalData.data[idx + 1], self.finalData.data[idx + 2]);
    };
    
    self.update_drag = function () {
        if(self.finalData==null){
            return;
        }
        if(self.in_drag){
            self.points_XYRGBR[self.current_index][0] = window.mouseRelativeX;
            self.points_XYRGBR[self.current_index][1] = window.mouseRelativeY;
            self.finish();
        }
    };

    self.white_all = function () {
        self.points_XYRGBR = [];
        self.finish();
    };

    self.load_latent_image = function (image, weight, height) {

        self.latent_canvas.width = parseInt(weight);
        self.latent_canvas.height = parseInt(height);

        let latent_ctx = self.latent_canvas.getContext('2d');
        latent_ctx.drawImage(image, 0, 0, self.latent_canvas.width, self.latent_canvas.height);
        self.latentData = latent_ctx.getImageData(0, 0, self.latent_canvas.width, self.latent_canvas.height);

        self.finish();
    };

    return self;
})();