module.exports = (function CreativeCanvas(name){

    let self = Object();

    self.spriteFrame = new cc.SpriteFrame();
    self.texture2d = null;

    self.canvas = document.createElement("canvas");
    self.canvas.id = 'canvas_' + name;

    self.finalData = null;

    self.points_XYRGBR = [];
    self.current_index = 0;

    self.records = [];

    self.time_line = 0;

    self.prex = 0.0;
    self.prey = 0.0;

    self.re = false;
    self.rex = 0.0;
    self.rey = 0.0;

    self.in_drag = false;

    self.ctx = null;

    self.create_k = function (){
        self.records = self.records.splice(0, self.time_line + 1);
        self.records.push(JSON.stringify(window.creativeCanvas.points_XYRGBR));
        self.time_line ++;
        this.flush_bg();
    };

    self.undo = function (){
        self.time_line --;
        if(self.time_line < 0){
            self.time_line = 0;
        }
        self.do();
        this.flush_bg();
    };

    self.redo = function (){
        self.time_line ++;
        if(self.time_line > self.records.length - 1){
            self.time_line = self.records.length - 1;
        }
        self.do();
        this.flush_bg();
    };

    self.do = function (){
        window.creativeCanvas.points_XYRGBR = JSON.parse(self.records[self.time_line]);
        self.finish();
    };

    self.ini = function (weight, height) {

        self.canvas.width = parseInt(weight);
        self.canvas.height = parseInt(height);

        self.ctx = self.canvas.getContext('2d');

        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        self.source = self.ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        self.records = [JSON.stringify([])];
        self.points_XYRGBR = [];
        self.time_line = 0;

        self.finish();

        return self.spriteFrame;
    };

    self.ini_image = function (image, weight, height) {

        ctx = self.canvas.getContext('2d');
        self.canvas.width = parseInt(weight);
        self.canvas.height = parseInt(height);
        ctx.drawImage(image, 0, 0, self.canvas.width, self.canvas.height);
        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);

        self.texture2d = new cc.Texture2D();
        self.spriteFrame.setTexture(self.texture2d);
        self.texture2d.initWithElement(self.canvas);
        self.texture2d.handleLoadedTexture(true);

        self.create_k();

        this.flush_bg();

        return self.spriteFrame;
    };

    self.flush = function () {
        let ctx = self.canvas.getContext('2d');
        self.source = ctx.getImageData(0, 0, self.canvas.width, self.canvas.height);
    };

    self.flush_bg = function () {
        // if(window.current_room != "new"){
        //     window.previewNode.opacity = 200;
        //     window.pendingNode.active = true;
        //     window.preview_xhr.abort();
        //     window.preview_xhr.open("POST", window.server_url + "/preview", true);
        //     window.preview_xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");
        //     window.preview_xhr.send
        //     (
        //         "room=" + window.current_room +
        //         "&points=" + encodeURIComponent(JSON.stringify(self.points_XYRGBR)) +
        //         "&faceID=" + window.faceID
        //     );
        // }
    };

    self.kill_preview = function () {
        window.pendingNode.active = false;
        window.previewNode.opacity = 255;
    };

    self.get_color = function (x, y) {
        if(self.source==null){
            return new [0, 0, 0, 0];
        }
        let idx = 0;
        idx = parseInt((1 - y) * self.canvas.height);
        idx = parseInt(idx * self.canvas.width);
        idx = parseInt(idx + x * self.canvas.width);
        idx = parseInt(idx * 4);
        return [self.source.data[idx + 0], self.source.data[idx + 1], self.source.data[idx + 2], self.source.data[idx + 3]];
    };

    self.set_big_point = function (ax, ay, r, g, b, a, k) {
        self.ctx.fillStyle="rgba("+r+","+g+","+b+","+a+")";
        self.ctx.fillRect(ax - k, ay - k, 2 * k + 1, 2 * k + 1); 
    };

    self.set_line = function (x0, y0, x1, y1, r, g, b, a, k){
        let dx = Math.abs(x1-x0);
        let dy = Math.abs(y1-y0);
        let sx = (x0 < x1) ? 1 : -1;
        let sy = (y0 < y1) ? 1 : -1;
        let err = dx-dy;
        while(true){
            self.set_big_point(x0,y0, r, g, b, a, k);
            if ((x0==x1) && (y0==y1)) break;
            let e2 = 2*err;
            if (e2 >-dy){ err -= dy; x0  += sx; }
            if (e2 < dx){ err += dx; y0  += sy; }
        }
    };

    self.clear_points = function(){
        self.points_XYRGBR = [];
    };

    self.add_point = function(){
        if (window.minecraft.index == 5){
            self.points_XYRGBR.push([self.rex, self.rey, 0, 233, 1]);
        }else if (window.minecraft.index == 6){
            self.points_XYRGBR.push([self.rex, self.rey, 1, 233, 0]);
        }else{
            self.points_XYRGBR.push([self.rex, self.rey, window.pickCanvas.currentColor[0], window.pickCanvas.currentColor[1], window.pickCanvas.currentColor[2]]);
        }
        self.current_index = self.points_XYRGBR.length - 1;
    };

    self.relocate_current_point = function(){
        if(self.current_index > -1 && self.current_index < self.points_XYRGBR.length){
            self.points_XYRGBR[self.current_index][0] = self.rex;
            self.points_XYRGBR[self.current_index][1] = self.rey;
        }
    };

    self.refresh_current_point_index = function(k){
        self.current_index = -1;
        let r = parseInt(50 / (window.drag_target.scaleX + 0.000001));
        if(window.isPen){
            r /= 2.0;
        }
        for(let i in self.points_XYRGBR){
            let dx = (self.points_XYRGBR[i][0] - self.rex) * self.canvas.width;
            let dy = (self.points_XYRGBR[i][1] - self.rey) * self.canvas.height;
            if (dx * dx + dy * dy < r * r){
                if(self.if_point_in_color(i) == window.in_color){
                    self.current_index = i;
                }
            }
        }
        if(self.current_index > -1){
            document.body.style.cursor = 'move';
        }else{
            document.body.style.cursor = 'auto';
        }
    };

    self.if_point_in_color = function(x){
        let item = self.points_XYRGBR[x];
        let r = item[2];
        let g = item[3];
        let b = item[4];
        if(r == 1 && g==233 && b==0){
            return false;
        }else if(r == 0 && g==233 && b==1){
            return false;
        }else{
            return true;
        }
    };

    self.finish = function () {
        if(self.ctx == null){
            return;
        }
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);
        for(let indcx=0; indcx < self.points_XYRGBR.length; indcx++){
            let item = self.points_XYRGBR[indcx];
            let xc = parseInt(item[0] * self.canvas.width);
            let yc = parseInt((1 - item[1]) * self.canvas.height);
            let r = item[2];
            let g = item[3];
            let b = item[4];
            if(r == 1 && g==233 && b==0){
                if(window.in_color){
                    continue;
                }
                self.ctx.strokeStyle = '#000000';
                self.ctx.lineWidth = 4.5; 
                self.ctx.beginPath();
                self.ctx.moveTo(xc - 12, yc - 12);
                self.ctx.lineTo(xc + 12, yc + 12);
                self.ctx.closePath();
                self.ctx.stroke();
                self.ctx.beginPath();
                self.ctx.moveTo(xc + 12, yc - 12);
                self.ctx.lineTo(xc - 12, yc + 12);
                self.ctx.closePath();
                self.ctx.stroke();
                self.ctx.strokeStyle = '#ffffff';
                self.ctx.lineWidth = 1.5; 
                self.ctx.beginPath();
                self.ctx.moveTo(xc - 10, yc - 10);
                self.ctx.lineTo(xc + 10, yc + 10);
                self.ctx.closePath();
                self.ctx.stroke();
                self.ctx.beginPath();
                self.ctx.moveTo(xc + 10, yc - 10);
                self.ctx.lineTo(xc - 10, yc + 10);
                self.ctx.closePath();
                self.ctx.stroke();
            }else if(r == 0 && g==233 && b==1){
                if(window.in_color){
                    continue;
                }
                self.ctx.strokeStyle = '#000000';
                self.ctx.lineWidth = 4.5; 
                self.ctx.beginPath();
                self.ctx.arc(xc, yc, 10, 0, 2*Math.PI);
                self.ctx.closePath();
                self.ctx.stroke();
                self.ctx.strokeStyle = '#ffffff';
                self.ctx.lineWidth = 1.5; 
                self.ctx.beginPath();
                self.ctx.arc(xc, yc, 10, 0, 2*Math.PI);
                self.ctx.closePath();
                self.ctx.stroke();
            }else{
                if(!window.in_color){
                    continue;
                }
                self.ctx.strokeStyle = 'rgba(' + (255 - r).toString() + ',' + (255 - g).toString() + ',' + (255 - b).toString() + ',1.0)';
                self.ctx.fillStyle = 'rgba(' + r.toString() + ',' + g.toString() + ',' + b.toString() + ',1.0)';
                self.ctx.lineWidth = 1.5; 
                self.ctx.beginPath();
                self.ctx.moveTo(xc - 7, yc - 7);
                self.ctx.lineTo(xc - 7, yc + 7);
                self.ctx.lineTo(xc + 7, yc + 7);
                self.ctx.lineTo(xc + 7, yc - 7);
                self.ctx.closePath();
                self.ctx.fill();
                self.ctx.stroke();
            }
        }
    };

    return self;
})();